<?php
// Test all file serving solutions for GoDaddy
// Run this from your browser: https://api.tedara.com/backend/public/test_all_solutions.php

echo "<h1>🧪 Test All File Serving Solutions - GoDaddy</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>";

$testImagePath = 'uploads/store/logos/2025/09/screenshot-13_1758556890_z3rDHF5g.jpg';
$baseUrl = 'https://api.tedara.com';

echo "<div class='info'>";
echo "<h2>🔧 Testing All Solutions</h2>";
echo "<p><strong>Test Image:</strong> $testImagePath</p>";
echo "<p><strong>Base URL:</strong> $baseUrl</p>";
echo "</div>";

// Test all different URL formats
$solutions = [
    '1. Direct Storage Access (404)' => $baseUrl . '/backend/storage/app/public/' . $testImagePath,
    '2. Original Serve-File Script' => $baseUrl . '/backend/public/serve-file/' . $testImagePath,
    '3. Simple Serve-File Script' => $baseUrl . '/backend/public/serve-file-simple/' . $testImagePath,
    '4. Laravel Route (serve-file)' => $baseUrl . '/backend/public/serve-file/' . $testImagePath,
    '5. Laravel Storage URL' => $baseUrl . '/backend/public/storage/' . $testImagePath,
];

echo "<h2>🧪 Testing All Solutions</h2>";

foreach ($solutions as $name => $url) {
    echo "<h3>$name</h3>";
    echo "<p><strong>URL:</strong> <a href='$url' target='_blank'>$url</a></p>";
    
    // Test if URL is accessible
    $headers = @get_headers($url);
    if ($headers && strpos($headers[0], '200') !== false) {
        echo "<div class='success'>✅ SUCCESS - Image loads correctly!</div>";
        echo "<p><img src='$url' alt='Test Image' style='max-width: 200px; max-height: 200px; border: 1px solid #ddd;'></p>";
    } else {
        echo "<div class='error'>❌ FAILED - Image does not load</div>";
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

// Test script existence
echo "<h2>📄 Script Existence Test</h2>";
$scripts = [
    'serve-file.php' => __DIR__ . '/serve-file.php',
    'serve-file-simple.php' => __DIR__ . '/serve-file-simple.php',
    'debug-serve-file.php' => __DIR__ . '/debug-serve-file.php',
];

foreach ($scripts as $name => $path) {
    echo "<p><strong>$name:</strong> " . (file_exists($path) ? '✅ Exists' : '❌ Missing') . " <code>$path</code></p>";
}

echo "<h2>📋 Summary</h2>";
echo "<p>This test checks all possible solutions:</p>";
echo "<ul>";
echo "<li>✅ Direct storage access (usually blocked on GoDaddy)</li>";
echo "<li>✅ Original serve-file script</li>";
echo "<li>✅ Simple serve-file script</li>";
echo "<li>✅ Laravel route-based serving</li>";
echo "<li>✅ Laravel storage URL</li>";
echo "</ul>";

echo "<h2>🔧 Next Steps</h2>";
echo "<p>Based on the results above:</p>";
echo "<ol>";
echo "<li>Find which solution works (shows ✅ SUCCESS)</li>";
echo "<li>Update the UrlHelper to use the working solution</li>";
echo "<li>Upload the necessary files to GoDaddy</li>";
echo "<li>Clear Laravel cache</li>";
echo "</ol>";

echo "<h2>💡 Alternative Solutions</h2>";
echo "<p>If none of the above work, try:</p>";
echo "<ul>";
echo "<li>Move files to public directory: <code>public/images/uploads/</code></li>";
echo "<li>Use a CDN service (Cloudinary, AWS S3)</li>";
echo "<li>Create a symbolic link in public directory</li>";
echo "<li>Use GoDaddy's file manager to set proper permissions</li>";
echo "</ul>";
?>
