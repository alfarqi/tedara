<?php
// Quick test for GoDaddy file structure
// Run this from your browser: https://api.tedara.com/backend/public/test_godaddy_structure.php

echo "<h1>🔍 GoDaddy File Structure Test</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>";

// Test the actual file path from your FTP
$testImagePath = 'uploads/store/logos/2025/09/screenshot-13_1758556489_2rBP0aiU.jpg';
$baseUrl = 'https://api.tedara.com';

echo "<div class='info'>";
echo "<h2>📁 File Structure Information</h2>";
echo "<p><strong>FTP Path:</strong> /public_html/backend/storage/app/public/uploads/store/logos/2025/09/</p>";
echo "<p><strong>Test Image:</strong> screenshot-13_1758556489_2rBP0aiU.jpg</p>";
echo "<p><strong>Base URL:</strong> $baseUrl</p>";
echo "</div>";

// Test different URL formats
$urlFormats = [
    'Current (Broken)' => $baseUrl . '/backend/public/storage/' . $testImagePath,
    'Correct Format' => $baseUrl . '/backend/storage/app/public/' . $testImagePath,
    'Direct Access' => $baseUrl . '/backend/storage/app/public/uploads/store/logos/2025/09/screenshot-13_1758556489_2rBP0aiU.jpg',
];

echo "<h2>🧪 Testing URL Formats</h2>";

foreach ($urlFormats as $name => $url) {
    echo "<h3>$name</h3>";
    echo "<p><strong>URL:</strong> <a href='$url' target='_blank'>$url</a></p>";
    
    // Test if URL is accessible
    $headers = @get_headers($url);
    if ($headers && strpos($headers[0], '200') !== false) {
        echo "<div class='success'>✅ URL is accessible - Image loads correctly!</div>";
        echo "<p><img src='$url' alt='Test Image' style='max-width: 200px; max-height: 200px; border: 1px solid #ddd;'></p>";
    } else {
        echo "<div class='error'>❌ URL is not accessible</div>";
        if ($headers) {
            echo "<p>Response: " . $headers[0] . "</p>";
        }
    }
    echo "<hr>";
}

// Test Laravel's URL generation
echo "<h2>🔧 Laravel URL Generation Test</h2>";

try {
    // Include Laravel bootstrap
    require_once __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    
    echo "<p><strong>APP_URL:</strong> " . config('app.url') . "</p>";
    echo "<p><strong>Storage URL:</strong> " . config('filesystems.disks.public.url') . "</p>";
    
    // Test the UrlHelper
    $generatedUrl = \App\Helpers\UrlHelper::buildLogoUrl($testImagePath);
    echo "<p><strong>Generated URL:</strong> <a href='$generatedUrl' target='_blank'>$generatedUrl</a></p>";
    
    // Test accessibility
    $headers = @get_headers($generatedUrl);
    if ($headers && strpos($headers[0], '200') !== false) {
        echo "<div class='success'>✅ Generated URL is accessible!</div>";
        echo "<p><img src='$generatedUrl' alt='Generated URL Test' style='max-width: 200px; max-height: 200px; border: 1px solid #ddd;'></p>";
    } else {
        echo "<div class='error'>❌ Generated URL is not accessible</div>";
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Error testing Laravel: " . $e->getMessage() . "</div>";
}

echo "<h2>📋 Summary</h2>";
echo "<p>The correct URL format for your GoDaddy hosting is:</p>";
echo "<code>https://api.tedara.com/backend/storage/app/public/uploads/store/logos/2025/09/filename.jpg</code>";

echo "<h2>🔧 Next Steps</h2>";
echo "<p>If the 'Correct Format' URL works above:</p>";
echo "<ol>";
echo "<li>✅ Upload the updated files to GoDaddy</li>";
echo "<li>✅ Clear Laravel cache: <code>php artisan config:clear</code></li>";
echo "<li>✅ Test your admin panel - logos should now display</li>";
echo "</ol>";
?>
