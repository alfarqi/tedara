<?php
// test_all_image_paths.php
// This script tests all image URL generation across the application

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "<h1>🧪 Testing All Image Paths</h1>";
    echo "<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; background: #f0f8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #fff0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #f0f0ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .warning { color: orange; background: #fff8f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        .test-section { border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>";
    
    echo "<div class='info'>";
    echo "<h2>🎯 Comprehensive Image URL Testing</h2>";
    echo "<p>This script tests all image URL generation across the application to ensure proper GoDaddy hosting compatibility.</p>";
    echo "</div>";
    
    // Test 1: UrlHelper Class
    echo "<div class='test-section'>";
    echo "<h2>1. 🔧 UrlHelper Class Testing</h2>";
    
    $testPaths = [
        'uploads/store/logos/2025/09/test-logo.jpg',
        'uploads/store/banners/2025/09/test-banner.jpg',
        'uploads/products/2025/09/test-product.jpg',
        'storage/app/public/uploads/store/logos/2025/09/test-logo.jpg',
        'test-filename.jpg',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    ];
    
    foreach ($testPaths as $path) {
        $logoUrl = \App\Helpers\UrlHelper::buildLogoUrl($path);
        $fileUrl = \App\Helpers\UrlHelper::buildFileUrl($path);
        
        echo "<h3>Path: <code>$path</code></h3>";
        echo "<p><strong>Logo URL:</strong> <a href='$logoUrl' target='_blank'>$logoUrl</a></p>";
        echo "<p><strong>File URL:</strong> <a href='$fileUrl' target='_blank'>$fileUrl</a></p>";
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 2: Store API Endpoints
    echo "<div class='test-section'>";
    echo "<h2>2. 🏪 Store API Testing</h2>";
    
    $storeEndpoints = [
        'https://api.tedara.com/api/stores/1',
        'https://api.tedara.com/api/storefront/fasool/theme',
    ];
    
    foreach ($storeEndpoints as $endpoint) {
        echo "<h3>Testing: <code>$endpoint</code></h3>";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
        
        if ($response && $httpCode === 200) {
            $data = json_decode($response, true);
            
            // Check for logo URLs
            if (isset($data['data']['logo'])) {
                $logoUrl = $data['data']['logo'];
                echo "<p><strong>Store Logo:</strong> <a href='$logoUrl' target='_blank'>$logoUrl</a></p>";
            }
            
            // Check for banner URLs
            if (isset($data['data']['settings']['banner_image'])) {
                $bannerUrl = $data['data']['settings']['banner_image'];
                echo "<p><strong>Banner Image:</strong> <a href='$bannerUrl' target='_blank'>$bannerUrl</a></p>";
            }
            
            // Check theme settings
            if (isset($data['data']['settings']['logo_url'])) {
                $logoUrl = $data['data']['settings']['logo_url'];
                echo "<p><strong>Theme Logo:</strong> <a href='$logoUrl' target='_blank'>$logoUrl</a></p>";
            }
            
            if (isset($data['data']['settings']['banner_url'])) {
                $bannerUrl = $data['data']['settings']['banner_url'];
                echo "<p><strong>Theme Banner:</strong> <a href='$bannerUrl' target='_blank'>$bannerUrl</a></p>";
            }
            
            // Check meta store data
            if (isset($data['meta']['store']['logo'])) {
                $logoUrl = $data['meta']['store']['logo'];
                echo "<p><strong>Meta Store Logo:</strong> <a href='$logoUrl' target='_blank'>$logoUrl</a></p>";
            }
        } else {
            echo "<div class='error'>❌ Failed to fetch data from endpoint</div>";
        }
        
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 3: Product API Endpoints
    echo "<div class='test-section'>";
    echo "<h2>3. 📦 Product API Testing</h2>";
    
    $productEndpoints = [
        'https://api.tedara.com/api/storefront/fasool/products',
        'https://api.tedara.com/api/storefront/fasool/products/1',
    ];
    
    foreach ($productEndpoints as $endpoint) {
        echo "<h3>Testing: <code>$endpoint</code></h3>";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
        
        if ($response && $httpCode === 200) {
            $data = json_decode($response, true);
            
            // Check for product images
            if (isset($data['data'])) {
                if (is_array($data['data']) && isset($data['data'][0])) {
                    // Multiple products
                    $products = $data['data'];
                    echo "<p><strong>Found " . count($products) . " products</strong></p>";
                    
                    foreach (array_slice($products, 0, 3) as $index => $product) {
                        if (isset($product['images']) && is_array($product['images'])) {
                            echo "<p><strong>Product " . ($index + 1) . " Images:</strong></p>";
                            foreach ($product['images'] as $imageIndex => $imageUrl) {
                                echo "<p>&nbsp;&nbsp;Image " . ($imageIndex + 1) . ": <a href='$imageUrl' target='_blank'>$imageUrl</a></p>";
                            }
                        }
                    }
                } else {
                    // Single product
                    $product = $data['data'];
                    if (isset($product['images']) && is_array($product['images'])) {
                        echo "<p><strong>Product Images:</strong></p>";
                        foreach ($product['images'] as $imageIndex => $imageUrl) {
                            echo "<p>Image " . ($imageIndex + 1) . ": <a href='$imageUrl' target='_blank'>$imageUrl</a></p>";
                        }
                    }
                }
            }
        } else {
            echo "<div class='error'>❌ Failed to fetch data from endpoint</div>";
        }
        
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 4: Image Accessibility
    echo "<div class='test-section'>";
    echo "<h2>4. 🖼️ Image Accessibility Testing</h2>";
    
    $testImages = [
        'https://api.tedara.com/backend/public/serve-file/uploads/store/logos/2025/09/screenshot-13_1758556890_z3rDHF5g.jpg',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    ];
    
    foreach ($testImages as $imageUrl) {
        echo "<h3>Testing: <code>$imageUrl</code></h3>";
        
        $headers = @get_headers($imageUrl);
        if ($headers && strpos($headers[0], '200') !== false) {
            echo "<div class='success'>✅ Image is accessible</div>";
            echo "<p><img src='$imageUrl' alt='Test Image' style='max-width: 200px; max-height: 200px; border: 1px solid #ddd;'></p>";
        } else {
            echo "<div class='error'>❌ Image is not accessible</div>";
            if ($headers) {
                echo "<p>Response: " . $headers[0] . "</p>";
            }
        }
        echo "<hr>";
    }
    echo "</div>";
    
    // Test 5: Configuration Check
    echo "<div class='test-section'>";
    echo "<h2>5. ⚙️ Configuration Check</h2>";
    
    echo "<p><strong>APP_URL:</strong> " . config('app.url') . "</p>";
    echo "<p><strong>Storage URL:</strong> " . \App\Helpers\UrlHelper::getStorageUrl() . "</p>";
    
    $filesystemConfig = config('filesystems.disks.public');
    echo "<p><strong>Filesystem Public URL:</strong> " . ($filesystemConfig['url'] ?? 'Not set') . "</p>";
    
    echo "</div>";
    
    echo "<div class='success'>";
    echo "<h2>✅ Image Path Testing Complete!</h2>";
    echo "<p>All image URL generation has been tested. Check the results above to ensure proper functionality.</p>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='error'>";
    echo "<h2>❌ Error</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
?>
