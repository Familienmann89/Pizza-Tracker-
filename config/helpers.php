<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';

function startAppSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'httponly' => true,
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'samesite' => 'Lax',
        'path' => '/',
    ]);

    session_start();
}

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireMethod(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        jsonResponse(['success' => false, 'error' => 'Methode nicht erlaubt.'], 405);
    }
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonResponse(['success' => false, 'error' => 'Ungültige JSON-Daten.'], 400);
    }

    return $data;
}

function currentUserId(): ?int
{
    startAppSession();
    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

function requireLogin(): int
{
    $userId = currentUserId();
    if ($userId === null) {
        jsonResponse(['success' => false, 'error' => 'Anmeldung erforderlich.'], 401);
    }
    return $userId;
}

function cleanString(mixed $value): string
{
    return trim(is_string($value) ? $value : '');
}

function loadPizzaData(): array
{
    static $data = null;
    if (is_array($data)) {
        return $data;
    }

    $path = __DIR__ . '/../data/pizza_data.json';
    $raw = file_get_contents($path);
    if ($raw === false) {
        throw new RuntimeException('Pizza-Daten konnten nicht geladen werden.');
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Pizza-Daten sind ungültig.');
    }

    $data = $decoded;
    return $data;
}

function assertChoice(string $section, string $value): void
{
    $data = loadPizzaData();
    if (!isset($data[$section][$value])) {
        jsonResponse(['success' => false, 'error' => "Ungültige Auswahl: {$value}"], 400);
    }
}

function assertChoices(string $section, array $values): void
{
    foreach ($values as $value) {
        if (!is_string($value)) {
            jsonResponse(['success' => false, 'error' => 'Ungültige Auswahl.'], 400);
        }
        assertChoice($section, $value);
    }
}

function calculatePizzaTotals(array $config, float $discountPercent = 0.0): array
{
    $data = loadPizzaData();
    $price = 0.0;
    $kcal = 0;

    $single = [
        'groessen' => $config['groesse'],
        'teige' => $config['teig'],
        'saucen' => $config['sauce'],
        'kaese' => $config['kaese'],
    ];

    foreach ($single as $section => $choice) {
        $price += (float) $data[$section][$choice]['preis'];
        $kcal += (int) $data[$section][$choice]['kcal'];
    }

    foreach (['belaege', 'extras'] as $section) {
        foreach ($config[$section] as $choice) {
            $price += (float) $data[$section][$choice]['preis'];
            $kcal += (int) $data[$section][$choice]['kcal'];
        }
    }

    $gross = round($price, 2);
    $discount = round($gross * max(0, min(100, $discountPercent)) / 100, 2);
    $final = round(max(0, $gross - $discount), 2);

    return [
        'preis_vor_rabatt' => $gross,
        'rabatt_betrag' => $discount,
        'preis' => $final,
        'kcal' => max(0, $kcal),
    ];
}

function validateCoupon(?string $code, ?int $userId = null): array
{
    $code = strtoupper(trim((string) $code));
    if ($code === '') {
        return ['code' => null, 'rabatt_prozent' => 0.0];
    }

    $pdo = getDatabase();
    $stmt = $pdo->prepare('SELECT code, rabatt_prozent, aktiv, gueltig_bis FROM gutscheine WHERE code = :code LIMIT 1');
    $stmt->execute(['code' => $code]);
    $coupon = $stmt->fetch();

    if (!$coupon) {
        jsonResponse(['success' => false, 'error' => 'Ungültiger Gutscheincode.'], 404);
    }

    if ((int) $coupon['aktiv'] !== 1) {
        jsonResponse(['success' => false, 'error' => 'Gutscheincode ist nicht aktiv.'], 400);
    }

    if (!empty($coupon['gueltig_bis']) && $coupon['gueltig_bis'] < date('Y-m-d')) {
        jsonResponse(['success' => false, 'error' => 'Gutscheincode ist abgelaufen.'], 410);
    }

    if ($code === 'WELCOME') {
        if ($userId === null) {
            jsonResponse(['success' => false, 'error' => 'WELCOME ist nur für registrierte Nutzer verfügbar.'], 401);
        }

        $used = $pdo->prepare('SELECT 1 FROM konfigurationen WHERE user_id = :user_id AND gutschein_code = :code LIMIT 1');
        $used->execute(['user_id' => $userId, 'code' => 'WELCOME']);
        if ($used->fetchColumn()) {
            jsonResponse(['success' => false, 'error' => 'WELCOME wurde bereits verwendet.'], 409);
        }
    }

    return [
        'code' => $coupon['code'],
        'rabatt_prozent' => (float) $coupon['rabatt_prozent'],
    ];
}

function normalizeConfig(array $input): array
{
    $config = [
        'name' => cleanString($input['name'] ?? 'Meine Pizza'),
        'groesse' => cleanString($input['groesse'] ?? ''),
        'teig' => cleanString($input['teig'] ?? ''),
        'sauce' => cleanString($input['sauce'] ?? ''),
        'kaese' => cleanString($input['kaese'] ?? ''),
        'belaege' => is_array($input['belaege'] ?? null) ? array_values($input['belaege']) : [],
        'extras' => is_array($input['extras'] ?? null) ? array_values($input['extras']) : [],
        'gutschein_code' => cleanString($input['gutschein_code'] ?? ''),
    ];

    if ($config['name'] === '') {
        $config['name'] = 'Meine Pizza';
    }

    if (mb_strlen($config['name']) > 100) {
        jsonResponse(['success' => false, 'error' => 'Der Name darf höchstens 100 Zeichen lang sein.'], 400);
    }

    foreach (['groesse', 'teig', 'sauce', 'kaese'] as $required) {
        if ($config[$required] === '') {
            jsonResponse(['success' => false, 'error' => 'Bitte alle Pflichtfelder auswählen.'], 400);
        }
    }

    assertChoice('groessen', $config['groesse']);
    assertChoice('teige', $config['teig']);
    assertChoice('saucen', $config['sauce']);
    assertChoice('kaese', $config['kaese']);
    assertChoices('belaege', $config['belaege']);
    assertChoices('extras', $config['extras']);

    return $config;
}
