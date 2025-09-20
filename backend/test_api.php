<?php
// Simple API test script
// Run this from your browser: https://api.tedara.com/test_api.php

echo "<h1>Tedara API Test</h1>";

$baseUrl = 'https://api.tedara.com/api';

$endpoints = [
    '/test' => 'Basic API Test',
    '/debug-questions-ratings' => 'Database Connection Test',
    '/debug-controller' => 'Controller Query Test'
];

foreach ($endpoints as $endpoint => $description) {
    echo "<h2>$description</h2>";
    echo "<p><strong>URL:</strong> $baseUrl$endpoint</p>";
    
    $url = $baseUrl . $endpoint;
    $response = @file_get_contents($url);
    
    if ($response === false) {
        echo "<p style='color: red;'><strong>Error:</strong> Failed to connect to API</p>";
    } else {
        echo "<p style='color: green;'><strong>Success!</strong></p>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
    }
    
    echo "<hr>";
}

echo "<h2>Environment Check</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Current Directory:</strong> " . getcwd() . "</p>";
echo "<p><strong>Laravel Public Directory:</strong> " . (file_exists('public/index.php') ? 'Exists' : 'Missing') . "</p>";
?>
