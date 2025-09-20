<?php
// Comprehensive redirect file for Laravel on GoDaddy
// This file handles all requests and serves them from the public directory

// Get the current request URI
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Define the public directory path
$publicDir = __DIR__ . '/public';

// If the request is for a file that exists in the public directory, serve it directly
if (file_exists($publicDir . $path)) {
    $filePath = $publicDir . $path;
    
    // Set appropriate content type
    $extension = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'php' => 'text/html',
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml'
    ];
    
    $mimeType = $mimeTypes[$extension] ?? mime_content_type($filePath);
    header('Content-Type: ' . $mimeType);
    
    // If it's a PHP file, include it instead of reading it
    if ($extension === 'php') {
        include $filePath;
    } else {
        readfile($filePath);
    }
    exit;
}

// For API routes and other requests, redirect to Laravel
$publicPath = '/public' . $requestUri;
header("Location: $publicPath");
exit;
?>