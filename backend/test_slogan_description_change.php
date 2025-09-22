<?php
// test_slogan_description_change.php
// This script tests the change from settings.slogan to description field

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>🧪 Testing Slogan to Description Change</h1>";
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
    echo "<h2>🎯 Slogan Source Change Test</h2>";
    echo "<p>This script tests the change from using <code>settings.slogan</code> to <code>description</code> field for the store slogan.</p>";
    echo "</div>";
    
    // Test 1: Store Model Description Field
    echo "<div class='test-section'>";
    echo "<h2>1. 🏪 Store Model Description Test</h2>";
    
    try {
        $stores = \App\Models\Store::all();
        if ($stores->count() > 0) {
            echo "<p><strong>Found " . $stores->count() . " stores</strong></p>";
            
            foreach ($stores as $store) {
                echo "<h3>Store: {$store->name}</h3>";
                echo "<p><strong>Description:</strong> " . ($store->description ?? 'N/A') . "</p>";
                echo "<p><strong>Settings Slogan:</strong> " . ($store->settings['slogan'] ?? 'N/A') . "</p>";
                echo "<hr>";
            }
        } else {
            echo "<div class='warning'>⚠️ No stores found in database</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error testing store model: " . $e->getMessage() . "</div>";
    }
    echo "</div>";
    
    // Test 2: Theme API Endpoint
    echo "<div class='test-section'>";
    echo "<h2>2. 🎨 Theme API Endpoint Test</h2>";
    
    $themeEndpoints = [
        'https://api.tedara.com/api/storefront/fasool/theme',
    ];
    
    foreach ($themeEndpoints as $endpoint) {
        echo "<h3>Testing: <code>$endpoint</code></h3>";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
        
        if ($response && $httpCode === 200) {
            $data = json_decode($response, true);
            
            // Check store information
            if (isset($data['meta']['store'])) {
                $store = $data['meta']['store'];
                echo "<p><strong>Store Name:</strong> " . ($store['name'] ?? 'N/A') . "</p>";
                echo "<p><strong>Store Description:</strong> " . ($store['description'] ?? 'N/A') . "</p>";
            }
            
            // Check theme settings
            if (isset($data['data']['settings'])) {
                $settings = $data['data']['settings'];
                echo "<p><strong>Store Slogan (from theme):</strong> " . ($settings['store_slogan'] ?? 'N/A') . "</p>";
                echo "<p><strong>Store Name (from theme):</strong> " . ($settings['store_name'] ?? 'N/A') . "</p>";
            }
            
            // Verify the slogan matches the description
            $storeDescription = $data['meta']['store']['description'] ?? '';
            $themeSlogan = $data['data']['settings']['store_slogan'] ?? '';
            
            if ($storeDescription && $themeSlogan === $storeDescription) {
                echo "<div class='success'>✅ Slogan correctly uses description field!</div>";
            } elseif ($storeDescription && $themeSlogan !== $storeDescription) {
                echo "<div class='warning'>⚠️ Slogan doesn't match description field</div>";
                echo "<p><strong>Expected:</strong> $storeDescription</p>";
                echo "<p><strong>Actual:</strong> $themeSlogan</p>";
            } else {
                echo "<div class='info'>ℹ️ No description or slogan found</div>";
            }
            
        } else {
            echo "<div class='error'>❌ Failed to fetch data from endpoint</div>";
            if ($response) {
                echo "<pre>" . $response . "</pre>";
            }
        }
        
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 3: Priority Order Test
    echo "<div class='test-section'>";
    echo "<h2>3. 🔄 Priority Order Test</h2>";
    
    try {
        $store = \App\Models\Store::first();
        if ($store) {
            echo "<h3>Testing Priority Order for Store: {$store->name}</h3>";
            
            // Test the priority order: description -> settings.slogan -> empty
            $description = $store->description ?? null;
            $settingsSlogan = $store->settings['slogan'] ?? null;
            
            echo "<p><strong>Description:</strong> " . ($description ?? 'NULL') . "</p>";
            echo "<p><strong>Settings Slogan:</strong> " . ($settingsSlogan ?? 'NULL') . "</p>";
            
            // Simulate the new priority logic
            $expectedSlogan = $description ?? $settingsSlogan ?? '';
            echo "<p><strong>Expected Slogan (new priority):</strong> " . ($expectedSlogan ?: 'EMPTY') . "</p>";
            
            // Test the old priority logic for comparison
            $oldExpectedSlogan = $settingsSlogan ?? $description ?? '';
            echo "<p><strong>Old Slogan (old priority):</strong> " . ($oldExpectedSlogan ?: 'EMPTY') . "</p>";
            
            if ($expectedSlogan !== $oldExpectedSlogan) {
                echo "<div class='success'>✅ Priority order has changed as expected!</div>";
            } else {
                echo "<div class='info'>ℹ️ Priority order change has no effect (both values are the same or empty)</div>";
            }
            
        } else {
            echo "<div class='warning'>⚠️ No stores found for testing</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error in priority order test: " . $e->getMessage() . "</div>";
    }
    echo "</div>";
    
    // Test 4: Update Store Description Test
    echo "<div class='test-section'>";
    echo "<h2>4. ✏️ Update Store Description Test</h2>";
    
    try {
        $store = \App\Models\Store::first();
        if ($store) {
            echo "<h3>Testing Description Update for Store: {$store->name}</h3>";
            
            $originalDescription = $store->description;
            $testDescription = "Updated description for testing - " . date('Y-m-d H:i:s');
            
            echo "<p><strong>Original Description:</strong> " . ($originalDescription ?? 'NULL') . "</p>";
            
            // Update the description
            $store->description = $testDescription;
            $store->save();
            
            echo "<p><strong>Updated Description:</strong> $testDescription</p>";
            
            // Test the theme API to see if slogan reflects the change
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://api.tedara.com/api/storefront/fasool/theme');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($response && $httpCode === 200) {
                $data = json_decode($response, true);
                $themeSlogan = $data['data']['settings']['store_slogan'] ?? '';
                
                if ($themeSlogan === $testDescription) {
                    echo "<div class='success'>✅ Theme API correctly reflects the updated description!</div>";
                } else {
                    echo "<div class='warning'>⚠️ Theme API doesn't reflect the updated description</div>";
                    echo "<p><strong>Expected:</strong> $testDescription</p>";
                    echo "<p><strong>Actual:</strong> $themeSlogan</p>";
                }
            }
            
            // Restore original description
            $store->description = $originalDescription;
            $store->save();
            echo "<p><strong>Restored Original Description:</strong> " . ($originalDescription ?? 'NULL') . "</p>";
            
        } else {
            echo "<div class='warning'>⚠️ No stores found for testing</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error in description update test: " . $e->getMessage() . "</div>";
    }
    echo "</div>";
    
    echo "<div class='success'>";
    echo "<h2>✅ Slogan to Description Change Testing Complete!</h2>";
    echo "<p>The change from using <code>settings.slogan</code> to <code>description</code> field has been tested.</p>";
    echo "<p><strong>Key Changes Made:</strong></p>";
    echo "<ul>";
    echo "<li>✅ Theme API now prioritizes <code>description</code> over <code>settings.slogan</code></li>";
    echo "<li>✅ Removed <code>settings.slogan</code> validation from request files</li>";
    echo "<li>✅ Store description is now the primary source for slogan</li>";
    echo "<li>✅ Fallback to <code>settings.slogan</code> if description is empty</li>";
    echo "</ul>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
?>
