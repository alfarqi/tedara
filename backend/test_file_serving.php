<?php
// Test file serving script for GoDaddy
// Run this from your browser: https://api.tedara.com/backend/public/test_file_serving.php

echo "<h1>📁 File Serving Test - GoDaddy</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>";

// Test the file serving script
$testImagePath = 'uploads/store/logos/2025/09/screenshot-13_1758556890_z3rDHF5g.jpg';
$baseUrl = 'https://api.tedara.com';

echo "<div class='info'>";
echo "<h2>🔧 File Serving Configuration</h2>";
echo "<p><strong>Test Image:</strong> $testImagePath</p>";
echo "<p><strong>Base URL:</strong> $baseUrl</p>";
echo "</div>";

// Test different URL formats
$urlFormats = [
    'Direct Access (404)' => $baseUrl . '/backend/storage/app/public/' . $testImagePath,
    'File Serving Script' => $baseUrl . '/backend/public/serve-file/' . $testImagePath,
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
        if ($headers) {
            echo "<p>Response: " . $headers[0] . "</p>";
        }
    }
    
} catch (Exception $e) {
    echo "<div class='error'>❌ Error testing Laravel: " . $e->getMessage() . "</div>";
}

// Test file existence
echo "<h2>📂 File Existence Test</h2>";
$fullPath = __DIR__ . '/../storage/app/public/' . $testImagePath;
echo "<p><strong>Full Path:</strong> <code>$fullPath</code></p>";
echo "<p><strong>File Exists:</strong> " . (file_exists($fullPath) ? '✅ Yes' : '❌ No') . "</p>";

if (file_exists($fullPath)) {
    echo "<p><strong>File Size:</strong> " . filesize($fullPath) . " bytes</p>";
    echo "<p><strong>File Permissions:</strong> " . substr(sprintf('%o', fileperms($fullPath)), -4) . "</p>";
}

echo "<h2>📋 Summary</h2>";
echo "<p>The file serving script should now work with URLs like:</p>";
echo "<code>https://api.tedara.com/backend/public/serve-file/uploads/store/logos/2025/09/filename.jpg</code>";

echo "<h2>🔧 Next Steps</h2>";
echo "<p>If the 'File Serving Script' URL works above:</p>";
echo "<ol>";
echo "<li>✅ Upload the updated files to GoDaddy</li>";
echo "<li>✅ Clear Laravel cache: <code>php artisan config:clear</code></li>";
echo "<li>✅ Test your admin panel - logos should now display</li>";
echo "</ol>";

echo "<h2>⚠️ Security Note</h2>";
echo "<p>The file serving script includes security measures:</p>";
echo "<ul>";
echo "<li>✅ Only allows specific file extensions</li>";
echo "<li>✅ Only allows files from specific paths</li>";
echo "<li>✅ Prevents directory traversal attacks</li>";
echo "<li>✅ Sets proper cache headers</li>";
echo "</ul>";
?>
