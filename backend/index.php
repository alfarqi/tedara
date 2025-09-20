<?php
// Laravel redirect for GoDaddy when document root points to backend/
// This file handles all requests and redirects them to the public directory

// Get the current request URI
$requestUri = $_SERVER['REQUEST_URI'];

// Remove query string for processing
$path = parse_url($requestUri, PHP_URL_PATH);

// If the request is for a file in the public directory, serve it directly
if (file_exists(__DIR__ . '/public' . $path)) {
    // Serve the file directly
    $filePath = __DIR__ . '/public' . $path;
    $mimeType = mime_content_type($filePath);
    header('Content-Type: ' . $mimeType);
    readfile($filePath);
    exit;
}

// For all other requests, redirect to Laravel
$publicPath = '/public' . $requestUri;
header("Location: $publicPath");
exit;
?>
