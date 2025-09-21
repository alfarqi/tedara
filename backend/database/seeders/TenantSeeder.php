<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\TenantDomain;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample tenants
        $tenants = [
            [
                'handle' => 'salmeen-electronics',
                'display_name' => 'Salmeen Electronics Store',
                'status' => 'active',
                'domains' => [
                    ['domain' => 'salmeen-electronics.local', 'is_primary' => true],
                    ['domain' => 'salmeen.tedara.com', 'is_primary' => false],
                ]
            ],
            [
                'handle' => 'fatooma-store',
                'display_name' => 'Fatooma Store',
                'status' => 'active',
                'domains' => [
                    ['domain' => 'fatooma-store.local', 'is_primary' => true],
                    ['domain' => 'fatooma.tedara.com', 'is_primary' => false],
                ]
            ],
            [
                'handle' => 'demo-store',
                'display_name' => 'Demo Store',
                'status' => 'active',
                'domains' => [
                    ['domain' => 'demo-store.local', 'is_primary' => true],
                ]
            ],
        ];

        foreach ($tenants as $tenantData) {
            $domains = $tenantData['domains'];
            unset($tenantData['domains']);

            $tenant = Tenant::create($tenantData);

            foreach ($domains as $domainData) {
                $domainData['tenant_id'] = $tenant->id;
                TenantDomain::create($domainData);
            }
        }
    }
}










