<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "=== DEBUGGING RECENT USER REGISTRATION ===\n\n";
    
    // Get the most recent user
    $recentUser = App\Models\User::orderBy('created_at', 'desc')->first();
    
    if (!$recentUser) {
        echo "❌ No users found in database\n";
        exit;
    }
    
    echo "1. MOST RECENT USER:\n";
    echo "   ID: " . $recentUser->id . "\n";
    echo "   Name: " . $recentUser->name . "\n";
    echo "   Email: " . $recentUser->email . "\n";
    echo "   Store Handle: '" . $recentUser->store_handle . "'\n";
    echo "   Store Name: '" . $recentUser->store_name . "'\n";
    echo "   Role: " . $recentUser->role . "\n";
    echo "   Created At: " . $recentUser->created_at . "\n\n";
    
    // Check if tenant exists for this user
    echo "2. CHECKING TENANT:\n";
    if (!empty($recentUser->store_handle)) {
        $tenant = App\Models\Tenant::where('handle', $recentUser->store_handle)->first();
        
        if ($tenant) {
            echo "   ✅ Tenant found!\n";
            echo "   Tenant ID: " . $tenant->id . "\n";
            echo "   Tenant Handle: " . $tenant->handle . "\n";
            echo "   Tenant Display Name: '" . $tenant->display_name . "'\n";
            echo "   Tenant Status: " . $tenant->status . "\n";
            echo "   Created At: " . $tenant->created_at . "\n";
        } else {
            echo "   ❌ No tenant found for handle: " . $recentUser->store_handle . "\n";
            
            // Check if there are any tenants at all
            $tenantCount = App\Models\Tenant::count();
            echo "   Total tenants in database: " . $tenantCount . "\n";
            
            if ($tenantCount > 0) {
                echo "   Recent tenants:\n";
                $recentTenants = App\Models\Tenant::orderBy('created_at', 'desc')->limit(5)->get();
                foreach ($recentTenants as $t) {
                    echo "     - " . $t->handle . " (" . $t->display_name . ") - " . $t->created_at . "\n";
                }
            }
        }
    } else {
        echo "   ❌ User has empty store_handle!\n";
    }
    
    // Check if domain exists
    echo "\n3. CHECKING DOMAIN:\n";
    if ($tenant) {
        $domain = App\Models\TenantDomain::where('tenant_id', $tenant->id)->first();
        if ($domain) {
            echo "   ✅ Domain found!\n";
            echo "   Domain: " . $domain->domain . "\n";
            echo "   Is Primary: " . ($domain->is_primary ? 'Yes' : 'No') . "\n";
        } else {
            echo "   ❌ No domain found for tenant!\n";
        }
    }
    
    // Check if theme settings exist
    echo "\n4. CHECKING THEME SETTINGS:\n";
    if ($tenant) {
        $themeSettings = App\Models\TenantThemeSetting::where('tenant_id', $tenant->id)->first();
        if ($themeSettings) {
            echo "   ✅ Theme settings found!\n";
            echo "   Theme ID: " . $themeSettings->theme_id . "\n";
        } else {
            echo "   ❌ No theme settings found for tenant!\n";
        }
    }
    
    // Check if home page exists
    echo "\n5. CHECKING HOME PAGE:\n";
    if ($tenant) {
        $homePage = App\Models\StorefrontPage::where('tenant_id', $tenant->id)
            ->where('slug', 'home')
            ->first();
        if ($homePage) {
            echo "   ✅ Home page found!\n";
            echo "   Page ID: " . $homePage->id . "\n";
            echo "   Page Title: " . $homePage->title . "\n";
        } else {
            echo "   ❌ No home page found for tenant!\n";
        }
    }
    
    // Test the event system manually
    echo "\n6. TESTING EVENT SYSTEM:\n";
    if (!empty($recentUser->store_handle)) {
        echo "   Attempting to dispatch UserRegistered event for recent user...\n";
        try {
            event(new App\Events\UserRegistered($recentUser));
            echo "   ✅ Event dispatched successfully!\n";
            
            // Check if tenant was created after event
            $tenantAfterEvent = App\Models\Tenant::where('handle', $recentUser->store_handle)->first();
            if ($tenantAfterEvent) {
                echo "   ✅ Tenant created after event dispatch!\n";
            } else {
                echo "   ❌ Tenant still not created after event dispatch!\n";
            }
        } catch (Exception $e) {
            echo "   ❌ Error dispatching event: " . $e->getMessage() . "\n";
        }
    }
    
    // Check event listeners
    echo "\n7. CHECKING EVENT LISTENERS:\n";
    $listeners = app('events')->getListeners('App\Events\UserRegistered');
    echo "   Registered listeners for UserRegistered event: " . count($listeners) . "\n";
    
    foreach ($listeners as $listener) {
        if (is_array($listener)) {
            $listenerClass = $listener[0];
            $listenerMethod = $listener[1];
            echo "   - " . $listenerClass . "@" . $listenerMethod . "\n";
        } else {
            echo "   - " . $listener . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
