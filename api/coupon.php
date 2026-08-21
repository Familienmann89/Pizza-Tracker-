<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/helpers.php';

requireMethod('POST');
$data = readJsonBody();
$code = cleanString($data['code'] ?? '');

if ($code === '') {
    jsonResponse(['success' => false, 'error' => 'Bitte einen Gutscheincode eingeben.'], 400);
}

$coupon = validateCoupon($code, currentUserId());
jsonResponse(['success' => true, 'coupon' => $coupon]);
