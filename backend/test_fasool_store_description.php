<?php
// test_fasool_store_description.php
// This script tests the Fasool store description API endpoint

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>Testing Fasool Store Description API</h1>";
    
    // Test the theme API endpoint
    $url = 'https://api.tedara.com/api/storefront/fasool/theme';
    
    echo "<h2>API Endpoint:</h2>";
    echo "<p><a href='{$url}' target='_blank'>{$url}</a></p>";
    
    // Make the API call
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "<h2>Response Status:</h2>";
    echo "<p>HTTP Code: {$httpCode}</p>";
    
    if ($response) {
        $data = json_decode($response, true);
        
        echo "<h2>Store Information:</h2>";
        if (isset($data['meta']['store'])) {
            $store = $data['meta']['store'];
            echo "<p><strong>Store Name:</strong> " . ($store['name'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Description:</strong> " . ($store['description'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Logo:</strong> " . ($store['logo'] ?? 'N/A') . "</p>";
        }
        
        echo "<h2>Theme Settings:</h2>";
        if (isset($data['data']['settings'])) {
            $settings = $data['data']['settings'];
            echo "<p><strong>Store Slogan:</strong> " . ($settings['store_slogan'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Name (from settings):</strong> " . ($settings['store_name'] ?? 'N/A') . "</p>";
        }
        
        echo "<h2>Full Response:</h2>";
        echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<p style='color: red;'>Failed to get response from API</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
