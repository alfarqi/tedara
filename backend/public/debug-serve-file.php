<?php
// Debug script for file serving on GoDaddy
// Run this from your browser: https://api.tedara.com/backend/public/debug-serve-file.php

echo "<h1>🔍 Debug File Serving - GoDaddy</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
</style>";

// Test the file serving script
$testImagePath = 'uploads/store/logos/2025/09/screenshot-13_1758556890_z3rDHF5g.jpg';

echo "<div class='info'>";
echo "<h2>🔧 Debug Information</h2>";
echo "<p><strong>Test Image Path:</strong> $testImagePath</p>";
echo "<p><strong>Current Directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>Request URI:</strong> " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "</p>";
echo "</div>";

// Test file existence
echo "<h2>📂 File Existence Test</h2>";
$fullPath = __DIR__ . '/../storage/app/public/' . $testImagePath;
echo "<p><strong>Full Path:</strong> <code>$fullPath</code></p>";
echo "<p><strong>File Exists:</strong> " . (file_exists($fullPath) ? '✅ Yes' : '❌ No') . "</p>";

if (file_exists($fullPath)) {
    echo "<p><strong>File Size:</strong> " . filesize($fullPath) . " bytes</p>";
    echo "<p><strong>File Permissions:</strong> " . substr(sprintf('%o', fileperms($fullPath)), -4) . "</p>";
    echo "<p><strong>Is Readable:</strong> " . (is_readable($fullPath) ? '✅ Yes' : '❌ No') . "</p>";
} else {
    echo "<div class='error'>❌ File not found at expected path</div>";
}

// Test directory structure
echo "<h2>📁 Directory Structure Test</h2>";
$directories = [
    __DIR__ . '/../storage/',
    __DIR__ . '/../storage/app/',
    __DIR__ . '/../storage/app/public/',
    __DIR__ . '/../storage/app/public/uploads/',
    __DIR__ . '/../storage/app/public/uploads/store/',
    __DIR__ . '/../storage/app/public/uploads/store/logos/',
    __DIR__ . '/../storage/app/public/uploads/store/logos/2025/',
    __DIR__ . '/../storage/app/public/uploads/store/logos/2025/09/',
];

foreach ($directories as $dir) {
    $exists = is_dir($dir);
    $readable = $exists ? is_readable($dir) : false;
    echo "<p><strong>" . basename($dir) . ":</strong> " . 
         ($exists ? '✅ Exists' : '❌ Missing') . 
         ($readable ? ' ✅ Readable' : ' ❌ Not Readable') . 
         " <code>$dir</code></p>";
}

// Test serve-file.php script
echo "<h2>🔧 Serve-File Script Test</h2>";
$serveFileScript = __DIR__ . '/serve-file.php';
echo "<p><strong>Serve-File Script:</strong> <code>$serveFileScript</code></p>";
echo "<p><strong>Script Exists:</strong> " . (file_exists($serveFileScript) ? '✅ Yes' : '❌ No') . "</p>";

if (file_exists($serveFileScript)) {
    echo "<p><strong>Script Readable:</strong> " . (is_readable($serveFileScript) ? '✅ Yes' : '❌ No') . "</p>";
    
    // Test the script logic
    echo "<h3>🧪 Testing Script Logic</h3>";
    
    // Simulate the script execution
    $requestUri = '/serve-file/' . $testImagePath;
    $pathInfo = parse_url($requestUri, PHP_URL_PATH);
    $filePath = str_replace('/serve-file/', '', $pathInfo);
    
    echo "<p><strong>Request URI:</strong> $requestUri</p>";
    echo "<p><strong>Path Info:</strong> $pathInfo</p>";
    echo "<p><strong>File Path:</strong> $filePath</p>";
    
    // Test file extension
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx'];
    echo "<p><strong>File Extension:</strong> $extension</p>";
    echo "<p><strong>Extension Allowed:</strong> " . (in_array($extension, $allowedExtensions) ? '✅ Yes' : '❌ No') . "</p>";
    
    // Test path validation
    $allowedPaths = ['uploads/', 'images/', 'documents/'];
    $pathAllowed = false;
    foreach ($allowedPaths as $allowedPath) {
        if (strpos($filePath, $allowedPath) === 0) {
            $pathAllowed = true;
            break;
        }
    }
    echo "<p><strong>Path Allowed:</strong> " . ($pathAllowed ? '✅ Yes' : '❌ No') . "</p>";
    
    // Test final file path
    $finalPath = __DIR__ . '/../storage/app/public/' . $filePath;
    echo "<p><strong>Final File Path:</strong> <code>$finalPath</code></p>";
    echo "<p><strong>Final File Exists:</strong> " . (file_exists($finalPath) ? '✅ Yes' : '❌ No') . "</p>";
}

// Test URL generation
echo "<h2>🔗 URL Generation Test</h2>";
$baseUrl = 'https://api.tedara.com';
$generatedUrl = $baseUrl . '/backend/public/serve-file/' . $testImagePath;
echo "<p><strong>Generated URL:</strong> <a href='$generatedUrl' target='_blank'>$generatedUrl</a></p>";

// Test direct access to serve-file.php
echo "<h2>🌐 Direct Script Access Test</h2>";
$directScriptUrl = $baseUrl . '/backend/public/serve-file.php';
echo "<p><strong>Direct Script URL:</strong> <a href='$directScriptUrl' target='_blank'>$directScriptUrl</a></p>";

echo "<h2>📋 Summary</h2>";
echo "<p>This debug script checks:</p>";
echo "<ul>";
echo "<li>✅ File existence and permissions</li>";
echo "<li>✅ Directory structure</li>";
echo "<li>✅ Serve-file script existence</li>";
echo "<li>✅ Script logic validation</li>";
echo "<li>✅ URL generation</li>";
echo "</ul>";

echo "<h2>🔧 Next Steps</h2>";
echo "<p>Based on the results above:</p>";
echo "<ol>";
echo "<li>If serve-file.php doesn't exist, upload it to the public directory</li>";
echo "<li>If directories are missing, create them with proper permissions</li>";
echo "<li>If files exist but aren't readable, fix file permissions</li>";
echo "<li>If script logic fails, check the serve-file.php code</li>";
echo "</ol>";
?>
