<?php

namespace Database\Seeders;

use App\Models\StorefrontPage;
use App\Models\StorefrontSection;
use App\Models\Tenant;
use App\Models\TenantThemeSetting;
use App\Models\Theme;
use Illuminate\Database\Seeder;

class StorefrontSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();
        $theme = Theme::where('key', 'modern')->first();

        foreach ($tenants as $tenant) {
            // Create theme settings for each tenant
            if ($theme) {
                TenantThemeSetting::create([
                    'tenant_id' => $tenant->id,
                    'theme_id' => $theme->id,
                    'settings' => [
                        'primary_color' => '#6f42c1',
                        'secondary_color' => '#6c757d',
                        'font_family' => 'Inter, sans-serif',
                        'header_style' => 'modern',
                        'footer_style' => 'simple',
                        'logo_url' => '/images/logo.png',
                        'favicon_url' => '/images/favicon.ico',
                    ]
                ]);
            }

            // Create home page
            $homePage = StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'home',
                'title' => 'Welcome to ' . $tenant->display_name,
                'template' => 'home',
                'seo_json' => [
                    'title' => 'Welcome to ' . $tenant->display_name,
                    'description' => 'Discover amazing products at ' . $tenant->display_name,
                    'keywords' => 'store, shopping, products, ' . $tenant->handle,
                ],
                'is_home' => true,
            ]);

            // Create sections for home page
            $sections = [
                [
                    'type' => 'hero',
                    'sort' => 1,
                    'props' => [
                        'title' => 'Welcome to ' . $tenant->display_name,
                        'subtitle' => 'Discover amazing products and great deals',
                        'background_image' => '/images/hero-bg.jpg',
                        'cta_text' => 'Shop Now',
                        'cta_link' => '/products',
                    ]
                ],
                [
                    'type' => 'featured_products',
                    'sort' => 2,
                    'props' => [
                        'title' => 'Featured Products',
                        'subtitle' => 'Check out our most popular items',
                        'limit' => 6,
                        'show_prices' => true,
                    ]
                ],
                [
                    'type' => 'about',
                    'sort' => 3,
                    'props' => [
                        'title' => 'About ' . $tenant->display_name,
                        'content' => 'We are committed to providing the best products and service to our customers.',
                        'image' => '/images/about.jpg',
                    ]
                ],
            ];

            foreach ($sections as $sectionData) {
                $sectionData['page_id'] = $homePage->id;
                StorefrontSection::create($sectionData);
            }

            // Create about page
            $aboutPage = StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'about',
                'title' => 'About Us',
                'template' => 'page',
                'seo_json' => [
                    'title' => 'About Us - ' . $tenant->display_name,
                    'description' => 'Learn more about ' . $tenant->display_name . ' and our mission.',
                    'keywords' => 'about, company, ' . $tenant->handle,
                ],
                'is_home' => false,
            ]);

            // Create sections for about page
            StorefrontSection::create([
                'page_id' => $aboutPage->id,
                'type' => 'content',
                'sort' => 1,
                'props' => [
                    'title' => 'About ' . $tenant->display_name,
                    'content' => 'We are a leading online store committed to providing high-quality products and exceptional customer service. Our mission is to make shopping convenient and enjoyable for our customers.',
                    'image' => '/images/about-hero.jpg',
                ]
            ]);

            // Create contact page
            $contactPage = StorefrontPage::create([
                'tenant_id' => $tenant->id,
                'slug' => 'contact',
                'title' => 'Contact Us',
                'template' => 'page',
                'seo_json' => [
                    'title' => 'Contact Us - ' . $tenant->display_name,
                    'description' => 'Get in touch with ' . $tenant->display_name . ' for any questions or support.',
                    'keywords' => 'contact, support, ' . $tenant->handle,
                ],
                'is_home' => false,
            ]);

            // Create sections for contact page
            StorefrontSection::create([
                'page_id' => $contactPage->id,
                'type' => 'contact_form',
                'sort' => 1,
                'props' => [
                    'title' => 'Get in Touch',
                    'subtitle' => 'We would love to hear from you',
                    'email' => 'contact@' . $tenant->handle . '.com',
                    'phone' => '+1 (555) 123-4567',
                    'address' => '123 Business Street, City, State 12345',
                ]
            ]);
        }
    }
}











