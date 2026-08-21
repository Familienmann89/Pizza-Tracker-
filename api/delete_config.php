<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('POST');
$userId = requireLogin();
$data = readJsonBody();
$id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    jsonResponse(['success' => false, 'error' => 'Ungültige Konfigurations-ID.'], 400);
}

$pdo = getDatabase();
$stmt = $pdo->prepare('DELETE FROM konfigurationen WHERE id = :id AND user_id = :user_id');
$stmt->execute(['id' => $id, 'user_id' => $userId]);

if ($stmt->rowCount() === 0) {
    jsonResponse(['success' => false, 'error' => 'Konfiguration nicht gefunden.'], 404);
}

jsonResponse(['success' => true]);
