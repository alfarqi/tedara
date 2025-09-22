<?php
// test_mobile_routing.php
// This script tests mobile routing and tenant detection issues

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>📱 Mobile Routing Debug Test</h1>";
    echo "<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .warning { color: orange; background: #fff8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .test-section { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>";
    
    echo "<div class='info'>";
    echo "<h2>🎯 Mobile Routing Issue Debug</h2>";
    echo "<p>This script helps debug why <code>tedara.com/fasool</code> shows 'store not found' on mobile but works on desktop.</p>";
    echo "</div>";
    
    // Test 1: Check if Fasool tenant exists
    echo "<div class='test-section'>";
    echo "<h2>1. 🏪 Fasool Tenant Check</h2>";
    
    try {
        $tenant = \App\Models\Tenant::where('handle', 'fasool')->first();
        if ($tenant) {
            echo "<div class='success'>✅ Fasool tenant found!</div>";
            echo "<p><strong>Handle:</strong> {$tenant->handle}</p>";
            echo "<p><strong>Display Name:</strong> {$tenant->display_name}</p>";
            echo "<p><strong>Status:</strong> {$tenant->status}</p>";
            
            // Check associated store
            $store = $tenant->store();
            if ($store) {
                echo "<p><strong>Store Name:</strong> {$store->name}</p>";
                echo "<p><strong>Store Status:</strong> {$store->status}</p>";
            } else {
                echo "<div class='warning'>⚠️ No store associated with Fasool tenant</div>";
            }
        } else {
            echo "<div class='error'>❌ Fasool tenant not found!</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error checking tenant: " . $e->getMessage() . "</div>";
    }
    echo "</div>";
    
    // Test 2: API Endpoint Test
    echo "<div class='test-section'>";
    echo "<h2>2. 🔌 API Endpoint Test</h2>";
    
    $apiUrl = 'https://api.tedara.com/api/storefront/fasool/theme';
    echo "<p><strong>Testing URL:</strong> <a href='$apiUrl' target='_blank'>$apiUrl</a></p>";
    
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
    $userAgent = curl_getinfo($ch, CURLINFO_USER_AGENT);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    echo "<p><strong>User Agent Used:</strong> $userAgent</p>";
    
    if ($response && $httpCode === 200) {
        $data = json_decode($response, true);
        echo "<div class='success'>✅ API endpoint working correctly!</div>";
        
        if (isset($data['meta']['store'])) {
            $store = $data['meta']['store'];
            echo "<p><strong>Store Name:</strong> " . ($store['name'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Description:</strong> " . ($store['description'] ?? 'N/A') . "</p>";
        }
    } else {
        echo "<div class='error'>❌ API endpoint failed</div>";
        if ($response) {
            echo "<pre>" . $response . "</pre>";
        }
    }
    echo "</div>";
    
    // Test 3: Mobile User Agent Test
    echo "<div class='test-section'>";
    echo "<h2>3. 📱 Mobile User Agent Test</h2>";
    
    $mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    ];
    
    foreach ($mobileUserAgents as $index => $userAgent) {
        echo "<h3>Test " . ($index + 1) . ": " . (strpos($userAgent, 'iPhone') !== false ? 'iPhone' : 'Android') . "</h3>";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json',
            'User-Agent: ' . $userAgent
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
        
        if ($httpCode === 200) {
            echo "<div class='success'>✅ Mobile user agent works correctly!</div>";
        } else {
            echo "<div class='error'>❌ Mobile user agent failed</div>";
        }
        
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 4: CORS Headers Test
    echo "<div class='test-section'>";
    echo "<h2>4. 🌐 CORS Headers Test</h2>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json',
        'Origin: https://tedara.com',
        'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    echo "<p><strong>Response Headers:</strong></p>";
    echo "<pre>" . $response . "</pre>";
    
    if (strpos($response, 'Access-Control-Allow-Origin') !== false) {
        echo "<div class='success'>✅ CORS headers present</div>";
    } else {
        echo "<div class='warning'>⚠️ CORS headers may be missing</div>";
    }
    echo "</div>";
    
    // Test 5: Frontend URL Test
    echo "<div class='test-section'>";
    echo "<h2>5. 🖥️ Frontend URL Test</h2>";
    
    $frontendUrl = 'https://tedara.com/fasool/';
    echo "<p><strong>Frontend URL:</strong> <a href='$frontendUrl' target='_blank'>$frontendUrl</a></p>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $frontendUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    
    if ($httpCode === 200) {
        if (strpos($response, 'store not found') !== false || strpos($response, 'Store Not Found') !== false) {
            echo "<div class='error'>❌ Frontend shows 'store not found' error</div>";
        } else {
            echo "<div class='success'>✅ Frontend loads correctly</div>";
        }
    } else {
        echo "<div class='error'>❌ Frontend failed to load</div>";
    }
    echo "</div>";
    
    // Test 6: Recommendations
    echo "<div class='test-section'>";
    echo "<h2>6. 💡 Recommendations</h2>";
    
    echo "<div class='info'>";
    echo "<h3>Possible Causes & Solutions:</h3>";
    echo "<ul>";
    echo "<li><strong>JavaScript Issues:</strong> Mobile browsers may have different JavaScript execution</li>";
    echo "<li><strong>Network Issues:</strong> Mobile networks may have different timeout settings</li>";
    echo "<li><strong>CORS Issues:</strong> Mobile browsers may be stricter about CORS</li>";
    echo "<li><strong>Cache Issues:</strong> Mobile browsers may have cached old versions</li>";
    echo "<li><strong>User Agent Detection:</strong> Backend may be blocking mobile user agents</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div class='warning'>";
    echo "<h3>Debugging Steps:</h3>";
    echo "<ol>";
    echo "<li>Open mobile browser developer tools</li>";
    echo "<li>Check console for JavaScript errors</li>";
    echo "<li>Check network tab for failed API calls</li>";
    echo "<li>Try clearing browser cache</li>";
    echo "<li>Test with different mobile browsers</li>";
    echo "</ol>";
    echo "</div>";
    echo "</div>";
    
    echo "<div class='success'>";
    echo "<h2>✅ Mobile Routing Debug Complete!</h2>";
    echo "<p>Check the results above to identify the cause of the mobile routing issue.</p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
?>
