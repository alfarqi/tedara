<?php
// Simple server status check

echo "🔍 Checking server status...\n\n";

// Check Laravel server
echo "1. Laravel Backend (http://localhost:8000):\n";
$laravelResponse = @file_get_contents('http://localhost:8000/api/test');
if ($laravelResponse !== false) {
    echo "   ✅ Laravel server is running\n";
    echo "   Response: " . substr($laravelResponse, 0, 100) . "...\n";
} else {
    echo "   ❌ Laravel server is not responding\n";
}

echo "\n";

// Check storefront server
echo "2. Storefront Frontend (http://localhost:5175):\n";
$storefrontResponse = @file_get_contents('http://localhost:5175');
if ($storefrontResponse !== false) {
    echo "   ✅ Storefront server is running\n";
    echo "   Response: HTML content received\n";
} else {
    echo "   ❌ Storefront server is not responding\n";
}

echo "\n";

// Test API endpoints
echo "3. Testing API endpoints:\n";

$endpoints = [
    'Theme API' => 'http://localhost:8000/api/storefront/feras-store/theme',
    'Home Page API' => 'http://localhost:8000/api/storefront/feras-store/page/home',
    'Products API' => 'http://localhost:8000/api/storefront/feras-store/products',
];

foreach ($endpoints as $name => $url) {
    $response = @file_get_contents($url);
    if ($response !== false) {
        $data = json_decode($response, true);
        echo "   ✅ {$name}: Working\n";
        if (isset($data['data'])) {
            echo "      Data keys: " . implode(', ', array_keys($data['data'])) . "\n";
        }
    } else {
        echo "   ❌ {$name}: Failed\n";
    }
}

echo "\n🎯 Test URLs:\n";
echo "   Storefront: http://localhost:5175/feras-store/\n";
echo "   API Test: http://localhost:8000/api/storefront/feras-store/theme\n";

echo "\n";
?>








