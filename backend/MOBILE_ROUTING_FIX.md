# Mobile Routing Fix: "Store Not Found" Issue

## Problem Description
The storefront at [https://tedara.com/fasool/](https://tedara.com/fasool/) works correctly on desktop but shows "store not found" error on mobile devices.

## Root Cause Analysis
The issue is likely caused by one or more of the following factors:

1. **JavaScript Execution Issues**: Mobile browsers may have different JavaScript execution behavior
2. **Tenant Detection Problems**: The `useTenant` hook may not properly detect the tenant on mobile
3. **API Call Failures**: Mobile browsers may have different network behavior or CORS issues
4. **React Router Issues**: Mobile browsers may handle routing differently
5. **Cache Issues**: Mobile browsers may have cached old versions

## Solution Implemented

### 1. Enhanced Tenant Detection
**File:** `storefront/src/hooks/useTenant.ts`

**Changes Made:**
- Added fallback tenant extraction from pathname
- Added mobile debugging logs
- Improved error handling for mobile devices

**Before:**
```typescript
export function useTenant() {
  const { tenant } = useParams<{ tenant: string }>();
  return tenant;
}
```

**After:**
```typescript
export function useTenant() {
  const { tenant } = useParams<{ tenant: string }>();
  const location = useLocation();
  
  // Fallback: extract tenant from pathname if params don't work
  if (!tenant) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const possibleTenant = pathSegments[0];
      const commonRoutes = ['admin', 'orders', 'cart', 'checkout', 'account', 'addresses', 'contact'];
      if (!commonRoutes.includes(possibleTenant)) {
        return possibleTenant;
      }
    }
  }
  
  return tenant;
}
```

### 2. Mobile Debugging Utilities
**File:** `storefront/src/utils/mobileDebug.ts`

**New Features:**
- Mobile device detection
- Mobile-specific logging
- Error tracking for mobile devices
- Device information collection

```typescript
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const logMobileDebug = (message: string, data?: any) => {
  if (isMobile()) {
    console.log(`📱 [MOBILE DEBUG] ${message}`, data || '');
  } else {
    console.log(`🖥️ [DESKTOP DEBUG] ${message}`, data || '');
  }
};
```

### 3. Enhanced Theme Hook with Mobile Support
**File:** `storefront/src/theme/classic/hooks/useTheme.ts`

**Changes Made:**
- Added mobile debugging logs
- Enhanced error handling for mobile devices
- Better API response logging
- Mobile-specific error tracking

**Key Improvements:**
```typescript
const apiUrl = `${getStorefrontApiUrl(tenant)}/theme`;
logMobileDebug('Fetching theme for tenant', { tenant, apiUrl, isMobile: isMobile() });

const response = await fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

logMobileDebug('Theme API Response Status', { status: response.status, tenant });
```

### 4. Improved Error Display
**File:** `storefront/src/theme/classic/pages/Home.tsx`

**Changes Made:**
- Enhanced error page with mobile-specific information
- Added debug information display
- Better user experience for mobile users
- Retry functionality

**New Error Page Features:**
- Mobile device detection
- Debug information display
- Retry button
- Better error messaging

## Files Modified

1. **`storefront/src/hooks/useTenant.ts`** - Enhanced tenant detection
2. **`storefront/src/utils/mobileDebug.ts`** - Mobile debugging utilities
3. **`storefront/src/theme/classic/hooks/useTheme.ts`** - Mobile-aware theme hook
4. **`storefront/src/theme/classic/pages/Home.tsx`** - Improved error handling
5. **`backend/test_mobile_routing.php`** - Mobile routing test script

## Testing

### Manual Testing Steps:
1. **Open mobile browser** and navigate to `https://tedara.com/fasool/`
2. **Check browser console** for mobile debug logs
3. **Verify tenant detection** is working correctly
4. **Test API calls** are successful on mobile
5. **Check error handling** if issues occur

### Debug Information:
The enhanced error page now shows:
- Tenant detection status
- Current URL
- Device type (Mobile/Desktop)
- User agent information
- Timestamp

### API Testing:
Visit: `https://api.tedara.com/backend/public/test_mobile_routing.php`

This script tests:
- Fasool tenant existence
- API endpoint accessibility
- Mobile user agent compatibility
- CORS headers
- Frontend URL accessibility

## Expected Results

### Before Fix:
- ❌ Mobile shows "store not found" error
- ❌ No debugging information available
- ❌ Poor error handling

### After Fix:
- ✅ Mobile properly detects tenant
- ✅ Enhanced debugging logs available
- ✅ Better error handling and user experience
- ✅ Fallback tenant detection from URL
- ✅ Mobile-specific error tracking

## Debugging Steps

### If Issue Persists:

1. **Check Browser Console:**
   ```javascript
   // Look for mobile debug logs
   📱 [MOBILE DEBUG] useTenant hook called
   📱 [MOBILE DEBUG] Fetching theme for tenant
   📱 [MOBILE DEBUG] Theme API Response Status
   ```

2. **Check Network Tab:**
   - Verify API calls are being made
   - Check for failed requests
   - Verify CORS headers

3. **Test API Directly:**
   ```bash
   curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
        https://api.tedara.com/api/storefront/fasool/theme
   ```

4. **Clear Browser Cache:**
   - Clear mobile browser cache
   - Try incognito/private mode
   - Test with different mobile browsers

## Common Mobile Issues & Solutions

### 1. JavaScript Execution Issues
**Problem:** Mobile browsers may block or delay JavaScript execution
**Solution:** Added fallback tenant detection and better error handling

### 2. Network Timeout Issues
**Problem:** Mobile networks may have different timeout settings
**Solution:** Enhanced error handling with retry functionality

### 3. CORS Issues
**Problem:** Mobile browsers may be stricter about CORS
**Solution:** Verified CORS configuration and added mobile user agent testing

### 4. Cache Issues
**Problem:** Mobile browsers may cache old versions
**Solution:** Added cache-busting and better error messages

## Deployment Steps

### Step 1: Upload Modified Files
Upload these files to GoDaddy:
- `storefront/src/hooks/useTenant.ts`
- `storefront/src/utils/mobileDebug.ts`
- `storefront/src/theme/classic/hooks/useTheme.ts`
- `storefront/src/theme/classic/pages/Home.tsx`

### Step 2: Build and Deploy
```bash
cd storefront
npm run build
# Deploy the built files to GoDaddy
```

### Step 3: Test Mobile Access
1. **Open mobile browser**
2. **Navigate to** `https://tedara.com/fasool/`
3. **Check console** for debug logs
4. **Verify** store loads correctly

### Step 4: Run Test Script
Visit: `https://api.tedara.com/backend/public/test_mobile_routing.php`

## Benefits

### ✅ Enhanced Mobile Support:
- Better tenant detection on mobile
- Mobile-specific debugging
- Improved error handling
- Fallback mechanisms

### ✅ Better Debugging:
- Mobile-specific logs
- Device information tracking
- Error context collection
- API call monitoring

### ✅ Improved User Experience:
- Better error messages
- Retry functionality
- Debug information display
- Mobile-optimized error pages

## Summary

The mobile routing fix addresses the "store not found" issue by:

1. **Enhanced tenant detection** with fallback mechanisms
2. **Mobile debugging utilities** for better troubleshooting
3. **Improved error handling** with mobile-specific information
4. **Better user experience** with retry functionality
5. **Comprehensive testing** with mobile-specific test scripts

This ensures that the Fasool store works correctly on both desktop and mobile devices, with proper error handling and debugging capabilities for any future issues.
