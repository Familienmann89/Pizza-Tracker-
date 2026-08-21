<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('POST');
$data = readJsonBody();

$fields = ['vorname', 'nachname', 'email', 'passwort', 'strasse', 'hausnummer', 'plz', 'stadt'];
foreach ($fields as $field) {
    if (cleanString($data[$field] ?? '') === '') {
        jsonResponse(['success' => false, 'error' => 'Bitte alle Pflichtfelder ausfüllen.'], 400);
    }
}

$email = mb_strtolower(cleanString($data['email'] ?? ''));
$password = (string) ($data['passwort'] ?? '');
$passwordConfirm = (string) ($data['passwort_bestaetigung'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'error' => 'Bitte eine gültige E-Mail-Adresse eingeben.'], 400);
}

if (mb_strlen($password) < 6) {
    jsonResponse(['success' => false, 'error' => 'Das Passwort muss mindestens 6 Zeichen lang sein.'], 400);
}

if ($passwordConfirm !== '' && $password !== $passwordConfirm) {
    jsonResponse(['success' => false, 'error' => 'Die Passwörter stimmen nicht überein.'], 400);
}

$pdo = getDatabase();
$exists = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
$exists->execute(['email' => $email]);
if ($exists->fetch()) {
    jsonResponse(['success' => false, 'error' => 'Diese E-Mail-Adresse ist bereits registriert.'], 409);
}

$stmt = $pdo->prepare(
    'INSERT INTO users (vorname, nachname, email, passwort, strasse, hausnummer, plz, stadt, telefon)
     VALUES (:vorname, :nachname, :email, :passwort, :strasse, :hausnummer, :plz, :stadt, :telefon)'
);
$stmt->execute([
    'vorname' => cleanString($data['vorname']),
    'nachname' => cleanString($data['nachname']),
    'email' => $email,
    'passwort' => password_hash($password, PASSWORD_BCRYPT),
    'strasse' => cleanString($data['strasse']),
    'hausnummer' => cleanString($data['hausnummer']),
    'plz' => cleanString($data['plz']),
    'stadt' => cleanString($data['stadt']),
    'telefon' => cleanString($data['telefon'] ?? '') ?: null,
]);

startAppSession();
session_regenerate_id(true);
$_SESSION['user_id'] = (int) $pdo->lastInsertId();
$_SESSION['vorname'] = cleanString($data['vorname']);
$_SESSION['email'] = $email;

jsonResponse([
    'success' => true,
    'user' => ['id' => $_SESSION['user_id'], 'vorname' => $_SESSION['vorname'], 'email' => $_SESSION['email']],
], 201);
