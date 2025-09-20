<?php
// Minimal script to echo CORS headers and request info
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5176',
    'http://localhost:3000',
    'https://tedara.com',
    'https://www.tedara.com',
    'https://tedara.netlify.app',
];
$allowOrigin = in_array($requestOrigin, $allowedOrigins, true) ? $requestOrigin : 'https://tedara.com';
header('Access-Control-Allow-Origin: ' . $allowOrigin);
header('Vary: Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
echo json_encode([
    'ok' => true,
    'method' => $_SERVER['REQUEST_METHOD'] ?? null,
    'origin' => $requestOrigin,
    'headers' => getallheaders(),
    'time' => gmdate('c'),
]);

