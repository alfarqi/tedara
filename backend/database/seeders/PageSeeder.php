<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Store;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first store to associate pages with
        $store = Store::first();
        
        if (!$store) {
            $this->command->warn('No store found. Please run StoreSeeder first.');
            return;
        }

        $pages = [
            [
                'title' => 'Return and Exchange Policy',
                'content' => '<h2>Return and Exchange Policy</h2><p>Returns are allowed within 3 days of receiving the order, but not after, to preserve product quality and shelf life. Exchanges are allowed within 7 days of receiving the order.</p><p>All shipping and delivery fees will be deducted, including costs for delivery to the customer and return to the store, as these are for shipping companies.</p><h3>Conditions for Returns:</h3><ul><li>Product must be in original packaging</li><li>Product must be unused and in original condition</li><li>Return request must be made within 3 days of delivery</li></ul>',
                'status' => 'active',
                'seo_title' => 'Return and Exchange Policy - ' . $store->name,
                'seo_url' => 'return-and-exchange-policy',
                'seo_description' => 'Our return and exchange policy outlines the conditions for returns and exchanges of products purchased from our store.',
                'show_in_footer' => true,
                'language' => 'EN',
            ],
            [
                'title' => 'Terms and Conditions',
                'content' => '<h2>Terms and Conditions</h2><p>By using our services, you agree to these terms and conditions. We reserve the right to modify these terms at any time. Your continued use of our services constitutes acceptance of any changes.</p><h3>User Responsibilities:</h3><ul><li>Provide accurate information when placing orders</li><li>Use the service in accordance with applicable laws</li><li>Respect intellectual property rights</li></ul><h3>Service Availability:</h3><p>We strive to maintain service availability but do not guarantee uninterrupted access to our platform.</p>',
                'status' => 'active',
                'seo_title' => 'Terms and Conditions - ' . $store->name,
                'seo_url' => 'terms-and-conditions',
                'seo_description' => 'Read our terms and conditions to understand the rules and guidelines for using our services.',
                'show_in_footer' => true,
                'language' => 'EN',
            ],
            [
                'title' => 'Privacy Policy',
                'content' => '<h2>Privacy Policy</h2><p>We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information. We do not sell or share your personal data with third parties without your consent.</p><h3>Information We Collect:</h3><ul><li>Personal information (name, email, phone number)</li><li>Order and transaction information</li><li>Website usage data and cookies</li></ul><h3>How We Use Your Information:</h3><ul><li>Process and fulfill your orders</li><li>Provide customer support</li><li>Send important updates about your orders</li><li>Improve our services</li></ul>',
                'status' => 'active',
                'seo_title' => 'Privacy Policy - ' . $store->name,
                'seo_url' => 'privacy-policy',
                'seo_description' => 'Learn about how we collect, use, and protect your personal information in accordance with our privacy policy.',
                'show_in_footer' => true,
                'language' => 'EN',
            ],
            [
                'title' => 'Shipping Information',
                'content' => '<h2>Shipping Information</h2><p>We offer fast and reliable shipping to ensure your orders arrive on time and in perfect condition.</p><h3>Shipping Options:</h3><ul><li><strong>Standard Shipping:</strong> 3-5 business days</li><li><strong>Express Shipping:</strong> 1-2 business days</li><li><strong>Same Day Delivery:</strong> Available in select areas</li></ul><h3>Shipping Costs:</h3><p>Shipping costs are calculated based on your location and the weight of your order. Free shipping is available on orders over $50.</p>',
                'status' => 'active',
                'seo_title' => 'Shipping Information - ' . $store->name,
                'seo_url' => 'shipping-information',
                'seo_description' => 'Learn about our shipping options, delivery times, and shipping costs.',
                'show_in_footer' => true,
                'language' => 'EN',
            ],
            [
                'title' => 'About Us',
                'content' => '<h2>About ' . $store->name . '</h2><p>We are a dedicated team committed to providing high-quality products and exceptional customer service. Our mission is to make shopping convenient and enjoyable for our customers.</p><h3>Our Values:</h3><ul><li><strong>Quality:</strong> We source only the best products</li><li><strong>Service:</strong> Customer satisfaction is our priority</li><li><strong>Innovation:</strong> We continuously improve our platform</li><li><strong>Trust:</strong> We build lasting relationships with our customers</li></ul><h3>Contact Information:</h3><p>If you have any questions or need assistance, please don\'t hesitate to contact us. We\'re here to help!</p>',
                'status' => 'active',
                'seo_title' => 'About Us - ' . $store->name,
                'seo_url' => 'about-us',
                'seo_description' => 'Learn more about our company, our values, and our commitment to providing excellent products and service.',
                'show_in_footer' => false,
                'language' => 'EN',
            ],
        ];

        foreach ($pages as $pageData) {
            Page::create([
                'store_id' => $store->id,
                ...$pageData
            ]);
        }

        $this->command->info('Created ' . count($pages) . ' sample pages for store: ' . $store->name);
    }
}












