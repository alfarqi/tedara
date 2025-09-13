<?php
// Test script for storefront API endpoints

echo "🧪 Testing Storefront API for Feras Store...\n\n";

$baseUrl = 'http://localhost:8000/api/storefront/feras-store';

// Test endpoints
$endpoints = [
    'Theme API' => '/theme',
    'Home Page' => '/page/home',
    'Catalog Page' => '/page/catalog',
    'About Page' => '/page/about',
    'Contact Page' => '/page/contact',
    'Products API' => '/products',
];

foreach ($endpoints as $name => $endpoint) {
    echo "Testing {$name}...\n";
    echo "URL: {$baseUrl}{$endpoint}\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "✅ Success (HTTP {$httpCode})\n";
        $data = json_decode($response, true);
        if (isset($data['data'])) {
            echo "   Data keys: " . implode(', ', array_keys($data['data'])) . "\n";
        }
    } else {
        echo "❌ Failed (HTTP {$httpCode})\n";
        echo "   Response: " . substr($response, 0, 200) . "...\n";
    }
    
    echo "\n";
}

echo "🎉 API testing complete!\n";
echo "\n📱 You can now test the storefront at:\n";
echo "http://localhost:5173/feras-store/\n";
echo "http://localhost:5173/feras-store/catalog\n";
echo "http://localhost:5173/feras-store/about\n";
echo "http://localhost:5173/feras-store/contact\n";
