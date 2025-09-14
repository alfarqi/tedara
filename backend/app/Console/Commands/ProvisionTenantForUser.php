<?php

namespace App\Console\Commands;

use App\Events\UserRegistered;
use App\Models\User;
use Illuminate\Console\Command;

class ProvisionTenantForUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenant:provision {user_id : The ID of the user to provision tenant for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Provision tenant defaults for an existing user';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $userId = $this->argument('user_id');
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }

        if (!$user->store_handle || !$user->store_name) {
            $this->error("User {$user->name} does not have store_handle or store_name set.");
            return 1;
        }

        $this->info("Provisioning tenant for user: {$user->name}");
        $this->info("Store: {$user->store_name} ({$user->store_handle})");

        // Dispatch the UserRegistered event
        event(new UserRegistered($user));

        $this->info("Tenant provisioning completed successfully!");
        $this->info("Tenant handle: {$user->store_handle}");
        $this->info("Domain: {$user->store_handle}.tedara.com");

        return 0;
    }
}



