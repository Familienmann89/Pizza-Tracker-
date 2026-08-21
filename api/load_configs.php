<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('GET');
$userId = requireLogin();
$pdo = getDatabase();
$stmt = $pdo->prepare(
    'SELECT id, name, groesse, teig, sauce, kaese, belaege, extras, gutschein_code, preis, erstellt_am
     FROM konfigurationen
     WHERE user_id = :user_id
     ORDER BY erstellt_am DESC, id DESC'
);
$stmt->execute(['user_id' => $userId]);
$configs = $stmt->fetchAll();

foreach ($configs as &$config) {
    $config['id'] = (int) $config['id'];
    $config['preis'] = (float) $config['preis'];
    $config['belaege'] = json_decode($config['belaege'] ?: '[]', true) ?: [];
    $config['extras'] = json_decode($config['extras'] ?: '[]', true) ?: [];
}
unset($config);

jsonResponse(['success' => true, 'configs' => $configs]);
