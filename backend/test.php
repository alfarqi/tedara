<?php
// Test file in backend root to check document root
echo "<h1>Backend Root Test</h1>";
echo "<p><strong>SUCCESS:</strong> Backend root is accessible!</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Current Time:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Script Name:</strong> " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p><strong>Current Working Directory:</strong> " . getcwd() . "</p>";

echo "<hr>";
echo "<h2>Directory Contents</h2>";
$files = scandir('.');
foreach ($files as $file) {
    if ($file != '.' && $file != '..') {
        $type = is_dir($file) ? '[DIR]' : '[FILE]';
        echo "<p>$type $file</p>";
    }
}

echo "<hr>";
echo "<h2>Test Links</h2>";
echo "<p><a href='public/'>Public Directory</a></p>";
echo "<p><a href='public/debug.php'>Public Debug</a></p>";
echo "<p><a href='public/index.php'>Laravel Index</a></p>";
echo "<p><a href='public/index.php/api/test'>API Test</a></p>";
?>
