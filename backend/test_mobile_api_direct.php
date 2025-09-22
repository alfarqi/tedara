<?php
// test_mobile_api_direct.php
// Direct test of the API endpoint that mobile is trying to access

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>📱 Direct Mobile API Test</h1>";
    echo "<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>";
    
    echo "<div class='info'>";
    echo "<h2>🎯 Testing the exact API endpoint that mobile is trying to access</h2>";
    echo "<p>This tests the theme API endpoint that the mobile app is calling.</p>";
    echo "</div>";
    
    // Test 1: Check if Fasool tenant exists
    echo "<h2>1. 🏪 Fasool Tenant Check</h2>";
    
    $tenant = \App\Models\Tenant::where('handle', 'fasool')->first();
    if ($tenant) {
        echo "<div class='success'>✅ Fasool tenant found!</div>";
        echo "<p><strong>Handle:</strong> {$tenant->handle}</p>";
        echo "<p><strong>Display Name:</strong> {$tenant->display_name}</p>";
        echo "<p><strong>Status:</strong> {$tenant->status}</p>";
    } else {
        echo "<div class='error'>❌ Fasool tenant not found!</div>";
        echo "<p>This is likely the cause of the 'store not found' error.</p>";
    }
    
    // Test 2: Check if Store exists
    echo "<h2>2. 🏬 Fasool Store Check</h2>";
    
    $store = \App\Models\Store::where('domain', 'fasool')->first();
    if ($store) {
        echo "<div class='success'>✅ Fasool store found!</div>";
        echo "<p><strong>Name:</strong> {$store->name}</p>";
        echo "<p><strong>Domain:</strong> {$store->domain}</p>";
        echo "<p><strong>Status:</strong> {$store->status}</p>";
        echo "<p><strong>Description:</strong> {$store->description}</p>";
    } else {
        echo "<div class='error'>❌ Fasool store not found!</div>";
        echo "<p>This is likely the cause of the 'store not found' error.</p>";
    }
    
    // Test 3: Direct API call simulation
    echo "<h2>3. 🔌 Direct API Call Simulation</h2>";
    
    $apiUrl = 'https://api.tedara.com/api/storefront/fasool/theme';
    echo "<p><strong>API URL:</strong> <a href='$apiUrl' target='_blank'>$apiUrl</a></p>";
    
    // Simulate the exact call the mobile app makes
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
    $error = curl_error($ch);
    curl_close($ch);
    
    echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
    
    if ($error) {
        echo "<div class='error'>❌ cURL Error: $error</div>";
    }
    
    if ($response && $httpCode === 200) {
        $data = json_decode($response, true);
        echo "<div class='success'>✅ API call successful!</div>";
        
        if (isset($data['meta']['store'])) {
            $store = $data['meta']['store'];
            echo "<p><strong>Store Name:</strong> " . ($store['name'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Description:</strong> " . ($store['description'] ?? 'N/A') . "</p>";
        }
        
        if (isset($data['data']['settings']['store_slogan'])) {
            echo "<p><strong>Store Slogan:</strong> " . $data['data']['settings']['store_slogan'] . "</p>";
        }
        
    } else {
        echo "<div class='error'>❌ API call failed!</div>";
        if ($response) {
            echo "<h3>Response:</h3>";
            echo "<pre>" . htmlspecialchars($response) . "</pre>";
        }
    }
    
    // Test 4: Check if the issue is with the seeder
    echo "<h2>4. 🌱 Seeder Check</h2>";
    
    if (!$tenant || !$store) {
        echo "<div class='error'>❌ Missing tenant or store data!</div>";
        echo "<p><strong>Solution:</strong> Run the FasoolStoreSeeder to create the missing data.</p>";
        echo "<p><strong>Command:</strong> <code>php artisan db:seed --class=FasoolStoreSeeder</code></p>";
        echo "<p><strong>Or visit:</strong> <a href='run_fasool_seeder.php' target='_blank'>run_fasool_seeder.php</a></p>";
    } else {
        echo "<div class='success'>✅ Tenant and store data exist!</div>";
    }
    
    // Test 5: Mobile-specific issues
    echo "<h2>5. 📱 Mobile-Specific Issues</h2>";
    
    echo "<div class='info'>";
    echo "<h3>Common Mobile Issues:</h3>";
    echo "<ul>";
    echo "<li><strong>JavaScript Execution:</strong> Mobile browsers may block or delay JavaScript</li>";
    echo "<li><strong>Network Timeouts:</strong> Mobile networks may have different timeout settings</li>";
    echo "<li><strong>CORS Issues:</strong> Mobile browsers may be stricter about CORS</li>";
    echo "<li><strong>Cache Issues:</strong> Mobile browsers may cache old versions</li>";
    echo "<li><strong>User Agent Blocking:</strong> Backend may be blocking mobile user agents</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div class='success'>";
    echo "<h2>✅ Mobile API Test Complete!</h2>";
    echo "<p>Check the results above to identify the cause of the mobile issue.</p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
?>
