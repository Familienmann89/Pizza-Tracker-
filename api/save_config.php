<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('POST');
$userId = requireLogin();
$config = normalizeConfig(readJsonBody());
$coupon = validateCoupon($config['gutschein_code'], $userId);
$totals = calculatePizzaTotals($config, (float) $coupon['rabatt_prozent']);

$pdo = getDatabase();
$stmt = $pdo->prepare(
    'INSERT INTO konfigurationen (user_id, name, groesse, teig, sauce, kaese, belaege, extras, gutschein_code, preis)
     VALUES (:user_id, :name, :groesse, :teig, :sauce, :kaese, :belaege, :extras, :gutschein_code, :preis)'
);
$stmt->execute([
    'user_id' => $userId,
    'name' => $config['name'],
    'groesse' => $config['groesse'],
    'teig' => $config['teig'],
    'sauce' => $config['sauce'],
    'kaese' => $config['kaese'],
    'belaege' => json_encode($config['belaege'], JSON_UNESCAPED_UNICODE),
    'extras' => json_encode($config['extras'], JSON_UNESCAPED_UNICODE),
    'gutschein_code' => $coupon['code'],
    'preis' => number_format($totals['preis'], 2, '.', ''),
]);

jsonResponse([
    'success' => true,
    'id' => (int) $pdo->lastInsertId(),
    'preis' => $totals['preis'],
    'kcal' => $totals['kcal'],
], 201);
