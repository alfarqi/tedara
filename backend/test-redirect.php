<?php
// Test file to verify redirect is working
echo "<h1>Redirect Test</h1>";
echo "<p><strong>SUCCESS:</strong> The redirect is working!</p>";
echo "<p><strong>Current URL:</strong> " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Script Path:</strong> " . __FILE__ . "</p>";

echo "<hr>";
echo "<h2>Test Links:</h2>";
echo "<p><a href='/'>Root URL</a></p>";
echo "<p><a href='/api/test'>API Test</a></p>";
echo "<p><a href='/backend/public/'>Backend Public</a></p>";
echo "<p><a href='/backend/public/api/test'>Backend Public API</a></p>";
?>
