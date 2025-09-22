<?php
// Simple script to run the Fasool Store seeder
// Run this from your browser: https://api.tedara.com/backend/public/run_fasool_seeder.php

echo "<h1>🌱 Fasool Store Seeder</h1>";
echo "<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; }
    .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; }
    .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; }
</style>";

try {
    // Include Laravel bootstrap
    require_once __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    
    echo "<div class='info'>";
    echo "<h2>🚀 Starting Fasool Store Seeder</h2>";
    echo "<p>Creating store, tenant, categories, and products...</p>";
    echo "</div>";
    
    // Run the seeder
    $seeder = new \Database\Seeders\FasoolStoreSeeder();
    $seeder->run();
    
    echo "<div class='success'>";
    echo "<h2>✅ Fasool Store Seeded Successfully!</h2>";
    echo "<p>The Fasool store has been created with:</p>";
    echo "<ul>";
    echo "<li>🏪 Store: Fasool Food Store</li>";
    echo "<li>👤 Owner: fasool@tedara.com</li>";
    echo "<li>🏷️ Tenant: fasool</li>";
    echo "<li>📂 5 Categories (Main Dishes, Appetizers, Beverages, Desserts, Fresh Ingredients)</li>";
    echo "<li>🍽️ 25 Products with authentic Middle Eastern food</li>";
    echo "<li>🖼️ High-quality Pexels images for all products</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div class='info'>";
    echo "<h2>🔗 Access Your Store</h2>";
    echo "<p>Your Fasool store is now available at:</p>";
    echo "<p><strong>Store URL:</strong> <a href='https://tedara.com/fasool/' target='_blank'>https://tedara.com/fasool/</a></p>";
    echo "<p><strong>Admin Login:</strong> fasool@tedara.com / password</p>";
    echo "</div>";
    
    echo "<h2>📋 Product Categories Created:</h2>";
    echo "<ul>";
    echo "<li>🍽️ <strong>Main Dishes:</strong> Mansaf, Kabsa, Maqluba, Shawarma, Grilled Fish</li>";
    echo "<li>🥗 <strong>Appetizers & Salads:</strong> Hummus, Fattoush, Baba Ganoush, Tabbouleh, Stuffed Grape Leaves</li>";
    echo "<li>🥤 <strong>Beverages:</strong> Orange Juice, Arabic Coffee, Mint Lemonade, Jallab, Pomegranate Juice</li>";
    echo "<li>🍰 <strong>Desserts:</strong> Baklava, Knafeh, Umm Ali, Maamoul, Rice Pudding</li>";
    echo "<li>🥬 <strong>Fresh Ingredients:</strong> Pita Bread, Herbs, Olive Oil, Dates, Mixed Nuts</li>";
    echo "</ul>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error Running Seeder</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<p>Please check your database connection and try again.</p>";
    echo "</div>";
}

echo "<h2>🔧 Manual Command</h2>";
echo "<p>You can also run this seeder manually using:</p>";
echo "<code>php artisan db:seed --class=FasoolStoreSeeder</code>";
?>
