<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            [
                'key' => 'modern',
                'name' => 'Modern Theme',
                'version' => '1.0.0',
                'is_enabled' => true,
            ],
            [
                'key' => 'classic',
                'name' => 'Classic Theme',
                'version' => '1.2.0',
                'is_enabled' => true,
            ],
            [
                'key' => 'minimal',
                'name' => 'Minimal Theme',
                'version' => '2.0.0',
                'is_enabled' => true,
            ],
        ];

        foreach ($themes as $theme) {
            Theme::create($theme);
        }
    }
}











