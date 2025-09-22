<?php
// test_theme_api_response.php
// Test the exact API response that's causing the TypeError

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>🔍 Theme API Response Test</h1>";
    echo "<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; max-height: 400px; }
        .json { background: #f8f8f8; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
    </style>";
    
    echo "<div class='info'>";
    echo "<h2>🎯 Testing Theme API Response Format</h2>";
    echo "<p>This test checks the exact response format that's causing the TypeError on mobile.</p>";
    echo "</div>";
    
    // Test 1: Direct API call
    echo "<h2>1. 🔌 Direct API Call</h2>";
    
    $apiUrl = 'https://api.tedara.com/api/storefront/fasool/theme';
    echo "<p><strong>API URL:</strong> <a href='$apiUrl' target='_blank'>$apiUrl</a></p>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $error = curl_error($ch);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    echo "<p><strong>Content-Type:</strong> $contentType</p>";
    
    if ($error) {
        echo "<div class='error'>❌ cURL Error: $error</div>";
    }
    
    if ($response) {
        echo "<h3>Raw Response:</h3>";
        echo "<div class='json'>";
        echo "<pre>" . htmlspecialchars($response) . "</pre>";
        echo "</div>";
        
        // Test JSON parsing
        echo "<h3>JSON Parsing Test:</h3>";
        $data = json_decode($response, true);
        $jsonError = json_last_error();
        
        if ($jsonError === JSON_ERROR_NONE) {
            echo "<div class='success'>✅ JSON is valid!</div>";
            
            // Check response structure
            echo "<h3>Response Structure Check:</h3>";
            
            if (isset($data['data'])) {
                echo "<div class='success'>✅ 'data' property exists</div>";
            } else {
                echo "<div class='error'>❌ 'data' property missing</div>";
            }
            
            if (isset($data['meta'])) {
                echo "<div class='success'>✅ 'meta' property exists</div>";
            } else {
                echo "<div class='error'>❌ 'meta' property missing</div>";
            }
            
            if (isset($data['meta']['store'])) {
                echo "<div class='success'>✅ 'meta.store' property exists</div>";
                echo "<p><strong>Store Name:</strong> " . ($data['meta']['store']['name'] ?? 'N/A') . "</p>";
            } else {
                echo "<div class='error'>❌ 'meta.store' property missing</div>";
            }
            
            if (isset($data['data']['settings'])) {
                echo "<div class='success'>✅ 'data.settings' property exists</div>";
            } else {
                echo "<div class='error'>❌ 'data.settings' property missing</div>";
            }
            
            // Pretty print the JSON
            echo "<h3>Formatted JSON:</h3>";
            echo "<div class='json'>";
            echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
            echo "</div>";
            
        } else {
            echo "<div class='error'>❌ JSON is invalid!</div>";
            echo "<p><strong>JSON Error:</strong> " . json_last_error_msg() . "</p>";
        }
    } else {
        echo "<div class='error'>❌ No response received</div>";
    }
    
    // Test 2: Check if the issue is with the backend
    echo "<h2>2. 🏗️ Backend Direct Test</h2>";
    
    try {
        // Simulate the ThemeController directly
        $tenant = \App\Models\Tenant::where('handle', 'fasool')->first();
        
        if ($tenant) {
            echo "<div class='success'>✅ Tenant found: {$tenant->handle}</div>";
            
            $store = $tenant->store();
            if ($store) {
                echo "<div class='success'>✅ Store found: {$store->name}</div>";
            } else {
                echo "<div class='error'>❌ Store not found for tenant</div>";
            }
        } else {
            echo "<div class='error'>❌ Tenant 'fasool' not found</div>";
        }
        
    } catch (Exception $e) {
        echo "<div class='error'>❌ Backend error: " . $e->getMessage() . "</div>";
    }
    
    // Test 3: Mobile-specific issues
    echo "<h2>3. 📱 Mobile-Specific Analysis</h2>";
    
    echo "<div class='info'>";
    echo "<h3>Common Causes of TypeError in Mobile:</h3>";
    echo "<ul>";
    echo "<li><strong>Malformed JSON:</strong> API returns invalid JSON</li>";
    echo "<li><strong>Empty Response:</strong> API returns empty string</li>";
    echo "<li><strong>HTML Error Page:</strong> API returns HTML instead of JSON</li>";
    echo "<li><strong>Network Issues:</strong> Partial response received</li>";
    echo "<li><strong>CORS Issues:</strong> Browser blocks the response</li>";
    echo "<li><strong>Content-Type Issues:</strong> Wrong content type header</li>";
    echo "</ul>";
    echo "</div>";
    
    // Test 4: Check response headers
    echo "<h2>4. 📋 Response Headers Test</h2>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    echo "<h3>Response Headers:</h3>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
    
    echo "<div class='success'>";
    echo "<h2>✅ Theme API Response Test Complete!</h2>";
    echo "<p>Check the results above to identify the cause of the TypeError.</p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
?>
