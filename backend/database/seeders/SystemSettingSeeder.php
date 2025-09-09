<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // System configuration
        SystemSetting::create([
            'key' => 'app_name',
            'value' => 'Tedara E-commerce',
            'description' => 'Application name',
        ]);

        SystemSetting::create([
            'key' => 'app_description',
            'value' => 'Multi-tenant e-commerce platform',
            'description' => 'Application description',
        ]);

        SystemSetting::create([
            'key' => 'default_currency',
            'value' => 'SAR',
            'description' => 'Default currency for new stores',
        ]);

        SystemSetting::create([
            'key' => 'default_language',
            'value' => 'ar',
            'description' => 'Default language for new stores',
        ]);

        SystemSetting::create([
            'key' => 'default_timezone',
            'value' => 'Asia/Riyadh',
            'description' => 'Default timezone for new stores',
        ]);

        // Email settings
        SystemSetting::create([
            'key' => 'email_from_name',
            'value' => 'Tedara Support',
            'description' => 'Default sender name for emails',
        ]);

        SystemSetting::create([
            'key' => 'email_from_address',
            'value' => 'support@tedara.com',
            'description' => 'Default sender email address',
        ]);

        // File upload settings
        SystemSetting::create([
            'key' => 'max_file_size',
            'value' => '10485760',
            'description' => 'Maximum file upload size in bytes (10MB)',
        ]);

        SystemSetting::create([
            'key' => 'allowed_file_types',
            'value' => '["jpg","jpeg","png","gif","webp","pdf","doc","docx"]',
            'description' => 'Allowed file types for uploads',
        ]);

        // Security settings
        SystemSetting::create([
            'key' => 'password_min_length',
            'value' => '8',
            'description' => 'Minimum password length',
        ]);

        SystemSetting::create([
            'key' => 'session_lifetime',
            'value' => '120',
            'description' => 'Session lifetime in minutes',
        ]);

        SystemSetting::create([
            'key' => 'max_login_attempts',
            'value' => '5',
            'description' => 'Maximum login attempts before lockout',
        ]);

        SystemSetting::create([
            'key' => 'lockout_duration',
            'value' => '15',
            'description' => 'Account lockout duration in minutes',
        ]);

        // Store settings
        SystemSetting::create([
            'key' => 'max_stores_per_user',
            'value' => '5',
            'description' => 'Maximum number of stores per user',
        ]);

        SystemSetting::create([
            'key' => 'store_approval_required',
            'value' => 'true',
            'description' => 'Whether store approval is required',
        ]);

        // Payment settings
        SystemSetting::create([
            'key' => 'payment_methods',
            'value' => '["mada","visa","mastercard","paypal"]',
            'description' => 'Available payment methods',
        ]);

        SystemSetting::create([
            'key' => 'tax_rate',
            'value' => '15',
            'description' => 'Default tax rate percentage',
        ]);

        // Notification settings
        SystemSetting::create([
            'key' => 'email_notifications_enabled',
            'value' => 'true',
            'description' => 'Enable email notifications',
        ]);

        SystemSetting::create([
            'key' => 'sms_notifications_enabled',
            'value' => 'false',
            'description' => 'Enable SMS notifications',
        ]);

        // Maintenance settings
        SystemSetting::create([
            'key' => 'maintenance_mode',
            'value' => 'false',
            'description' => 'Global maintenance mode',
        ]);

        SystemSetting::create([
            'key' => 'maintenance_message',
            'value' => 'We are currently performing maintenance. Please check back soon.',
            'description' => 'Maintenance mode message',
        ]);
    }
}
