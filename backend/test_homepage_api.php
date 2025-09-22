<?php
// Comprehensive Home Page API Test Script for GoDaddy
// Run this from your browser: https://api.tedara.com/backend/public/test_homepage_api.php

echo "<h1>🏠 Home Page API Test - GoDaddy</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
</style>";

$baseUrl = 'https://api.tedara.com/backend/public/api/storefront';
$tenants = ['fashion-store', 'feras-store', 'sameer-store']; // Add your tenant handles

echo "<div class='info'>";
echo "<h2>🔧 Environment Information</h2>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Current Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>Base URL:</strong> $baseUrl</p>";
echo "<p><strong>Testing Tenants:</strong> " . implode(', ', $tenants) . "</p>";
echo "</div>";

// Test basic API connectivity
echo "<div class='endpoint'>";
echo "<h2>🌐 Basic API Connectivity Test</h2>";
$testUrl = 'https://api.tedara.com/backend/public/api/test';
echo "<p><strong>URL:</strong> $testUrl</p>";

$response = @file_get_contents($testUrl);
if ($response !== false) {
    echo "<div class='success'>✅ API is accessible!</div>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
} else {
    echo "<div class='error'>❌ API is not accessible. Check your GoDaddy configuration.</div>";
}
echo "</div>";

// Test each tenant's home page
foreach ($tenants as $tenant) {
    echo "<div class='endpoint'>";
    echo "<h2>🏪 Testing Tenant: $tenant</h2>";
    
    $endpoints = [
        'Home Page' => "/$tenant/page/home",
        'All Pages' => "/$tenant/pages", 
        'Theme' => "/$tenant/theme",
        'Products' => "/$tenant/products"
    ];
    
    foreach ($endpoints as $name => $endpoint) {
        echo "<h3>📄 $name</h3>";
        $url = $baseUrl . $endpoint;
        echo "<p><strong>URL:</strong> <a href='$url' target='_blank'>$url</a></p>";
        
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => [
                    'Accept: application/json',
                    'Content-Type: application/json',
                    'User-Agent: HomePageAPITest/1.0'
                ],
                'timeout' => 30
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response !== false) {
            $data = json_decode($response, true);
            if ($data !== null) {
                echo "<div class='success'>✅ Success - Valid JSON response</div>";
                echo "<p><strong>Response Keys:</strong> " . implode(', ', array_keys($data)) . "</p>";
                
                // Show specific data for home page
                if ($name === 'Home Page' && isset($data['data'])) {
                    $pageData = $data['data'];
                    echo "<p><strong>Page Title:</strong> " . ($pageData['title'] ?? 'N/A') . "</p>";
                    echo "<p><strong>Page Slug:</strong> " . ($pageData['slug'] ?? 'N/A') . "</p>";
                    echo "<p><strong>Is Home:</strong> " . ($pageData['is_home'] ? 'Yes' : 'No') . "</p>";
                    echo "<p><strong>Sections Count:</strong> " . count($pageData['sections'] ?? []) . "</p>";
                }
                
                // Show first 500 characters of response
                echo "<details><summary>View Response (first 500 chars)</summary>";
                echo "<pre>" . htmlspecialchars(substr($response, 0, 500)) . "...</pre>";
                echo "</details>";
            } else {
                echo "<div class='error'>❌ Invalid JSON response</div>";
                echo "<pre>" . htmlspecialchars(substr($response, 0, 200)) . "...</pre>";
            }
        } else {
            echo "<div class='error'>❌ Failed to connect</div>";
            $error = error_get_last();
            if ($error) {
                echo "<p>Error: " . htmlspecialchars($error['message']) . "</p>";
            }
        }
        echo "<hr>";
    }
    echo "</div>";
}

// Test CORS
echo "<div class='endpoint'>";
echo "<h2>🔒 CORS Test</h2>";
$corsUrl = 'https://api.tedara.com/backend/public/api/cors-test';
echo "<p><strong>URL:</strong> $corsUrl</p>";

$response = @file_get_contents($corsUrl);
if ($response !== false) {
    echo "<div class='success'>✅ CORS endpoint accessible</div>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
} else {
    echo "<div class='error'>❌ CORS test failed</div>";
}
echo "</div>";

// Performance test
echo "<div class='endpoint'>";
echo "<h2>⚡ Performance Test</h2>";
$startTime = microtime(true);
$testUrl = $baseUrl . '/fashion-store/page/home';
$response = @file_get_contents($testUrl);
$endTime = microtime(true);
$responseTime = round(($endTime - $startTime) * 1000, 2);

if ($response !== false) {
    echo "<div class='success'>✅ Response time: {$responseTime}ms</div>";
    if ($responseTime < 1000) {
        echo "<p>🚀 Good performance!</p>";
    } elseif ($responseTime < 3000) {
        echo "<p>⚠️ Acceptable performance</p>";
    } else {
        echo "<p>🐌 Slow response - consider optimization</p>";
    }
} else {
    echo "<div class='error'>❌ Performance test failed</div>";
}
echo "</div>";

echo "<h2>📋 Summary</h2>";
echo "<p>This test script checks:</p>";
echo "<ul>";
echo "<li>✅ Basic API connectivity</li>";
echo "<li>✅ Home page endpoints for each tenant</li>";
echo "<li>✅ JSON response validation</li>";
echo "<li>✅ CORS configuration</li>";
echo "<li>✅ Response time performance</li>";
echo "</ul>";

echo "<h2>🔧 Troubleshooting</h2>";
echo "<p>If tests fail, check:</p>";
echo "<ul>";
echo "<li>GoDaddy hosting configuration</li>";
echo "<li>Laravel .htaccess file</li>";
echo "<li>Database connectivity</li>";
echo "<li>Tenant data exists in database</li>";
echo "<li>CORS headers in public/index.php</li>";
echo "</ul>";
?>
