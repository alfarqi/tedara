<?php
// test_store_settings_fix.php
// This script tests the store settings update functionality

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>Testing Store Settings Update Fix</h1>";
    
    // Test the store update API endpoint
    $storeId = 1; // Assuming store ID 1 exists
    $url = "https://api.tedara.com/api/stores/{$storeId}";
    
    echo "<h2>API Endpoint:</h2>";
    echo "<p><a href='{$url}' target='_blank'>{$url}</a></p>";
    
    // Test data for updating store settings
    $testData = [
        'name' => 'Fasool Food Store',
        'description' => 'Fresh and delicious food store offering authentic Middle Eastern cuisine, fresh ingredients, and homemade specialties',
        'settings' => [
            'contact_email' => 'info@fasool.com',
            'contact_phone' => '+966501234567',
            'slogan' => 'Authentic Middle Eastern Cuisine'
        ]
    ];
    
    echo "<h2>Test Data:</h2>";
    echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";
    
    // Make the API call (GET request to test the endpoint)
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
        if (isset($data['data'])) {
            $store = $data['data'];
            echo "<p><strong>Store Name:</strong> " . ($store['name'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Description:</strong> " . ($store['description'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Logo:</strong> " . ($store['logo'] ?? 'N/A') . "</p>";
            echo "<p><strong>Store Settings:</strong></p>";
            echo "<pre>" . json_encode($store['settings'] ?? [], JSON_PRETTY_PRINT) . "</pre>";
        }
        
        echo "<h2>Full Response:</h2>";
        echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<p style='color: red;'>Failed to get response from API</p>";
    }
    
    echo "<h2>Testing UrlHelper Class:</h2>";
    
    // Test the UrlHelper class directly
    $testLogoPath = 'uploads/store/logos/2025/09/test-logo.jpg';
    $logoUrl = \App\Helpers\UrlHelper::buildLogoUrl($testLogoPath);
    
    echo "<p><strong>Test Logo Path:</strong> {$testLogoPath}</p>";
    echo "<p><strong>Generated Logo URL:</strong> {$logoUrl}</p>";
    
    // Test with null value
    $nullLogoUrl = \App\Helpers\UrlHelper::buildLogoUrl(null);
    echo "<p><strong>Null Logo URL:</strong> " . ($nullLogoUrl ?? 'null') . "</p>";
    
    // Test with full URL
    $fullUrlLogo = \App\Helpers\UrlHelper::buildLogoUrl('https://example.com/logo.jpg');
    echo "<p><strong>Full URL Logo:</strong> {$fullUrlLogo}</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
