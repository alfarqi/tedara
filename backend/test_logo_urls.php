<?php
// Test script for logo URL generation on GoDaddy
// Run this from your browser: https://api.tedara.com/backend/public/test_logo_urls.php

echo "<h1>🖼️ Logo URL Generation Test - GoDaddy</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    .test-case { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
</style>";

// Include Laravel bootstrap
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "<div class='info'>";
echo "<h2>🔧 Environment Information</h2>";
echo "<p><strong>APP_URL:</strong> " . config('app.url') . "</p>";
echo "<p><strong>Storage URL:</strong> " . config('filesystems.disks.public.url') . "</p>";
echo "<p><strong>Current Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "</div>";

// Test different logo path formats
$testPaths = [
    'uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg',
    'storage/uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg',
    'screenshot-13_1758554814_jdyzkwOZ.jpg',
    'https://api.tedara.com/backend/storage/app/public/uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg',
    '/uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg',
];

echo "<div class='test-case'>";
echo "<h2>🧪 Testing Logo URL Generation</h2>";

foreach ($testPaths as $index => $path) {
    echo "<h3>Test Case " . ($index + 1) . "</h3>";
    echo "<p><strong>Input Path:</strong> <code>$path</code></p>";
    
    try {
        // Test the UrlHelper
        $generatedUrl = \App\Helpers\UrlHelper::buildLogoUrl($path);
        echo "<p><strong>Generated URL:</strong> <code>$generatedUrl</code></p>";
        
        // Test if URL is valid
        if (filter_var($generatedUrl, FILTER_VALIDATE_URL)) {
            echo "<div class='success'>✅ Valid URL generated</div>";
            
            // Test if the URL is accessible
            $headers = @get_headers($generatedUrl);
            if ($headers && strpos($headers[0], '200') !== false) {
                echo "<div class='success'>✅ URL is accessible</div>";
            } else {
                echo "<div class='error'>❌ URL is not accessible (file may not exist)</div>";
            }
        } else {
            echo "<div class='error'>❌ Invalid URL generated</div>";
        }
    } catch (Exception $e) {
        echo "<div class='error'>❌ Error: " . $e->getMessage() . "</div>";
    }
    
    echo "<hr>";
}

echo "</div>";

// Test actual store data
echo "<div class='test-case'>";
echo "<h2>🏪 Testing Store Logo URLs</h2>";

try {
    $stores = \App\Models\Store::whereNotNull('logo')->limit(5)->get();
    
    if ($stores->count() > 0) {
        foreach ($stores as $store) {
            echo "<h3>Store: {$store->name}</h3>";
            echo "<p><strong>Original Logo Path:</strong> <code>{$store->logo}</code></p>";
            
            $logoUrl = \App\Helpers\UrlHelper::buildLogoUrl($store->logo);
            echo "<p><strong>Generated Logo URL:</strong> <code>$logoUrl</code></p>";
            
            // Test accessibility
            $headers = @get_headers($logoUrl);
            if ($headers && strpos($headers[0], '200') !== false) {
                echo "<div class='success'>✅ Logo is accessible</div>";
                echo "<p><img src='$logoUrl' alt='Store Logo' style='max-width: 100px; max-height: 100px; border: 1px solid #ddd;'></p>";
            } else {
                echo "<div class='error'>❌ Logo is not accessible</div>";
            }
            
            echo "<hr>";
        }
    } else {
        echo "<p>No stores with logos found in database.</p>";
    }
} catch (Exception $e) {
    echo "<div class='error'>❌ Error accessing stores: " . $e->getMessage() . "</div>";
}

echo "</div>";

// Test file system configuration
echo "<div class='test-case'>";
echo "<h2>⚙️ File System Configuration Test</h2>";

$storagePath = storage_path('app/public');
$publicPath = public_path('storage');

echo "<p><strong>Storage Path:</strong> <code>$storagePath</code></p>";
echo "<p><strong>Public Path:</strong> <code>$publicPath</code></p>";
echo "<p><strong>Storage Exists:</strong> " . (is_dir($storagePath) ? '✅ Yes' : '❌ No') . "</p>";
echo "<p><strong>Public Storage Exists:</strong> " . (is_dir($publicPath) ? '✅ Yes' : '❌ No') . "</p>";

// Check if symbolic link exists
if (is_link($publicPath)) {
    echo "<p><strong>Symbolic Link:</strong> ✅ Yes (points to: " . readlink($publicPath) . ")</p>";
} else {
    echo "<p><strong>Symbolic Link:</strong> ❌ No</p>";
}

echo "</div>";

echo "<h2>📋 Summary</h2>";
echo "<p>This test script checks:</p>";
echo "<ul>";
echo "<li>✅ Logo URL generation for different path formats</li>";
echo "<li>✅ URL validity and accessibility</li>";
echo "<li>✅ Actual store logo URLs from database</li>";
echo "<li>✅ File system configuration</li>";
echo "</ul>";

echo "<h2>🔧 Next Steps</h2>";
echo "<p>If logos are still not loading:</p>";
echo "<ul>";
echo "<li>1. Run <code>php artisan storage:link</code> on GoDaddy</li>";
echo "<li>2. Check file permissions on storage directory</li>";
echo "<li>3. Verify .htaccess configuration</li>";
echo "<li>4. Clear Laravel cache: <code>php artisan cache:clear</code></li>";
echo "</ul>";
?>
