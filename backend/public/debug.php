<?php
// Debug file to check what's happening
echo "<h1>Laravel Public Directory Debug</h1>";
echo "<p><strong>SUCCESS:</strong> You can access the public directory!</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Current Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Script Name:</strong> " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p><strong>Current Working Directory:</strong> " . getcwd() . "</p>";

echo "<hr>";
echo "<h2>Laravel Files Check</h2>";
$laravel_files = [
    'index.php' => 'Laravel index.php',
    '../vendor/autoload.php' => 'Composer autoload',
    '../bootstrap/app.php' => 'Laravel bootstrap',
    '../.env' => 'Environment file'
];

foreach ($laravel_files as $file => $description) {
    $exists = file_exists($file);
    echo "<p><strong>$description:</strong> " . ($exists ? "✅ Found" : "❌ Missing") . "</p>";
}

echo "<hr>";
echo "<h2>Test Links</h2>";
echo "<p><a href='/'>Root URL</a></p>";
echo "<p><a href='/api/test'>API Test</a></p>";
echo "<p><a href='/index.php'>Laravel Index</a></p>";
echo "<p><a href='/index.php/api/test'>API Test with index.php</a></p>";

echo "<hr>";
echo "<p><em>Debug completed at: " . date('Y-m-d H:i:s') . "</em></p>";
?>
