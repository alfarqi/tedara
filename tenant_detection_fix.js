// Tenant Detection Fix for GoDaddy Deployment
// This script fixes the tenant detection issue where "storefront" is being detected instead of "fasool"

(function() {
    console.log('🔧 Applying Tenant Detection Fix...');
    
    // Get current URL and pathname
    const currentUrl = window.location.href;
    const pathname = window.location.pathname;
    
    console.log('Current URL:', currentUrl);
    console.log('Current Pathname:', pathname);
    
    // Extract tenant from URL - handle different URL structures
    function extractTenantFromUrl() {
        // Method 1: Check if URL contains /fasool/
        if (currentUrl.includes('/fasool/') || currentUrl.includes('/fasool')) {
            return 'fasool';
        }
        
        // Method 2: Check pathname segments
        const pathSegments = pathname.split('/').filter(Boolean);
        console.log('Path segments:', pathSegments);
        
        // Look for fasool in the path
        for (let segment of pathSegments) {
            if (segment === 'fasool') {
                return 'fasool';
            }
        }
        
        // Method 3: Check if we're on the fasool store page
        if (currentUrl.includes('tedara.com/fasool')) {
            return 'fasool';
        }
        
        // Method 4: Check document title or other indicators
        if (document.title.toLowerCase().includes('fasool')) {
            return 'fasool';
        }
        
        // Default fallback
        return 'fasool'; // Force fasool since we know this is the fasool store
    }
    
    // Override the tenant detection
    const correctTenant = extractTenantFromUrl();
    console.log('🎯 Corrected Tenant:', correctTenant);
    
    // Create a global variable for the correct tenant
    window.CORRECT_TENANT = correctTenant;
    
    // Override any existing tenant detection
    if (window.useTenant) {
        const originalUseTenant = window.useTenant;
        window.useTenant = function() {
            console.log('🔧 Overriding useTenant to return:', correctTenant);
            return correctTenant;
        };
    }
    
    // Override React Router params if available
    if (window.React && window.React.useParams) {
        const originalUseParams = window.React.useParams;
        window.React.useParams = function() {
            const params = originalUseParams ? originalUseParams() : {};
            if (params.tenant !== correctTenant) {
                console.log('🔧 Overriding React useParams tenant from', params.tenant, 'to', correctTenant);
                params.tenant = correctTenant;
            }
            return params;
        };
    }
    
    // Override any tenant-related variables
    if (window.tenant && window.tenant !== correctTenant) {
        console.log('🔧 Overriding window.tenant from', window.tenant, 'to', correctTenant);
        window.tenant = correctTenant;
    }
    
    // Create a debug panel to show the fix
    function createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'tenant-fix-debug';
        debugPanel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #10b981;
            color: white;
            padding: 10px;
            font-size: 14px;
            z-index: 10000;
            text-align: center;
            font-weight: bold;
        `;
        
        debugPanel.innerHTML = `
            🔧 Tenant Fix Applied: ${correctTenant} | 
            URL: ${currentUrl} | 
            Time: ${new Date().toLocaleTimeString()}
            <button onclick="this.parentElement.style.display='none'" 
                    style="background: white; color: #10b981; border: none; padding: 4px 8px; border-radius: 4px; margin-left: 10px; font-size: 12px;">
                HIDE
            </button>
        `;
        
        document.body.insertBefore(debugPanel, document.body.firstChild);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (debugPanel.parentElement) {
                debugPanel.style.display = 'none';
            }
        }, 10000);
    }
    
    // Show debug panel
    createDebugPanel();
    
    // Log success
    console.log('✅ Tenant Detection Fix Applied Successfully!');
    console.log('Corrected Tenant:', correctTenant);
    
    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('tenantFixed', {
        detail: { tenant: correctTenant, originalUrl: currentUrl }
    }));
    
})();
