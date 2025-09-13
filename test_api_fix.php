<?php
// Test if the API endpoints are working correctly

echo "🧪 Testing API endpoints for storefront fix...\n\n";

$baseUrl = 'http://localhost:8000/api/storefront/feras-store';

$endpoints = [
    'Theme API' => '/theme',
    'Home Page' => '/page/home',
    'Products API' => '/products',
];

foreach ($endpoints as $name => $endpoint) {
    echo "Testing {$name}...\n";
    
    $url = $baseUrl . $endpoint;
    $response = @file_get_contents($url);
    
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data && isset($data['data'])) {
            echo "   ✅ Success - JSON data received\n";
            echo "   Data keys: " . implode(', ', array_keys($data['data'])) . "\n";
        } else {
            echo "   ❌ Failed - Invalid JSON response\n";
            echo "   Response: " . substr($response, 0, 100) . "...\n";
        }
    } else {
        echo "   ❌ Failed - No response\n";
    }
    echo "\n";
}

echo "🎯 The storefront should now work at: http://localhost:5174/feras-store/\n";
echo "The JSON parsing errors should be resolved!\n";
?>

