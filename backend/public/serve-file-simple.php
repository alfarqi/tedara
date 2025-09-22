<?php
// Simple file serving script for GoDaddy
// This script serves files from the storage directory

// Get the file path from the URL
$requestUri = $_SERVER['REQUEST_URI'];
$pathInfo = parse_url($requestUri, PHP_URL_PATH);

// Extract the file path after /serve-file-simple/
$filePath = str_replace('/serve-file-simple/', '', $pathInfo);

// Security: Only allow certain file types
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
$extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    http_response_code(403);
    die('File type not allowed');
}

// Security: Only allow uploads path
if (!strpos($filePath, 'uploads/') === 0) {
    http_response_code(403);
    die('Path not allowed');
}

// Construct full file path
$fullPath = __DIR__ . '/../storage/app/public/' . $filePath;

// Check if file exists
if (!file_exists($fullPath)) {
    http_response_code(404);
    die('File not found: ' . $filePath);
}

// Set appropriate headers
$mimeTypes = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp',
    'svg' => 'image/svg+xml',
];

$mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($fullPath));
header('Cache-Control: public, max-age=31536000');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');

// Output the file
readfile($fullPath);
?>
