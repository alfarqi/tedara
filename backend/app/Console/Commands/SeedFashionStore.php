<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\FashionStoreSeeder;

class SeedFashionStore extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:fashion-store';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the fashion store with categories and products';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌟 Starting Fashion Store Seeder...');
        
        try {
            $seeder = new FashionStoreSeeder();
            $seeder->run();
            
            $this->info('✅ Fashion store seeded successfully!');
            $this->info('🏪 Store: Fashion Store');
            $this->info('🔗 Handle: fashion-store');
            $this->info('👤 Owner: fashion@tedara.com');
            $this->info('📦 Products: 15 fashion items across 5 categories');
            
        } catch (\Exception $e) {
            $this->error('❌ Error seeding fashion store: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
