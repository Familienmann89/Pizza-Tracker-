<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('POST');
$data = readJsonBody();
$email = mb_strtolower(cleanString($data['email'] ?? ''));
$password = (string) ($data['passwort'] ?? '');

if ($email === '' || $password === '') {
    jsonResponse(['success' => false, 'error' => 'E-Mail und Passwort sind erforderlich.'], 400);
}

$pdo = getDatabase();
$stmt = $pdo->prepare('SELECT id, vorname, email, passwort FROM users WHERE email = :email LIMIT 1');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['passwort'])) {
    jsonResponse(['success' => false, 'error' => 'E-Mail oder Passwort ist falsch.'], 401);
}

startAppSession();
session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['vorname'] = (string) $user['vorname'];
$_SESSION['email'] = (string) $user['email'];

jsonResponse([
    'success' => true,
    'user' => ['id' => (int) $user['id'], 'vorname' => $user['vorname'], 'email' => $user['email']],
]);
