<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('GET');
startAppSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => true, 'loggedIn' => false]);
}

jsonResponse([
    'success' => true,
    'loggedIn' => true,
    'user' => [
        'id' => (int) $_SESSION['user_id'],
        'vorname' => (string) ($_SESSION['vorname'] ?? ''),
        'email' => (string) ($_SESSION['email'] ?? ''),
    ],
]);
