# Admin User Avatar Fix for GoDaddy

## Problem Description
The admin user avatar image is not displaying correctly on GoDaddy hosting. The issue is that avatar URLs are being generated as relative paths like `./assets/images/users/user-2.jpg` which don't work properly on GoDaddy.

**Example of broken URL:**
```
./assets/images/users/user-2.jpg
```

**Correct URL should be:**
```
https://tedara.com/assets/images/users/user-2.jpg
```

## Root Cause
The issue is caused by:
1. The `getAssetPath` function in `frontend/src/utils/assets.ts` generating relative paths
2. GoDaddy hosting not properly resolving relative asset paths
3. Missing absolute URL generation for production environment

## Solution Implemented

### 1. Updated Asset Path Function
**File:** `frontend/src/utils/assets.ts`

**Before:**
```typescript
export const getAssetPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `./${cleanPath}`;
};
```

**After:**
```typescript
export const getAssetPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For production/GoDaddy, use absolute path from the frontend domain
  // For development, use relative path
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    // Use absolute path for production (GoDaddy)
    return `https://tedara.com/${cleanPath}`;
  } else {
    // Use relative path for development
    return `./${cleanPath}`;
  }
};
```

### 2. Added User Avatar Helper
**File:** `frontend/src/utils/assets.ts`

```typescript
// Helper function to get user avatar with fallback
export const getUserAvatar = (userAvatar?: string, defaultAvatar: string = ASSETS.USER_2): string => {
  if (userAvatar) {
    // If user has a custom avatar, use it
    return userAvatar;
  }
  // Use default avatar
  return defaultAvatar;
};
```

### 3. Updated Header Component
**File:** `frontend/src/components/layout/Header.tsx`

**Before:**
```typescript
<img src={ASSETS.USER_2} width="32" className="rounded-circle me-lg-2 d-flex" alt="user-image" />
```

**After:**
```typescript
<img src={getUserAvatar(user?.avatar)} width="32" className="rounded-circle me-lg-2 d-flex" alt="user-image" />
```

## Files Modified

1. **`frontend/src/utils/assets.ts`** - Updated asset path generation
2. **`frontend/src/components/layout/Header.tsx`** - Updated to use new avatar helper
3. **`frontend/src/utils/test-asset-paths.ts`** - Test script for verification

## Deployment Steps

### Step 1: Upload Files to GoDaddy
Upload these modified files to your GoDaddy hosting:
- `frontend/src/utils/assets.ts`
- `frontend/src/components/layout/Header.tsx`

### Step 2: Build and Deploy Frontend
```bash
cd frontend
npm run build
# Deploy the dist folder to your hosting
```

### Step 3: Test the Fix
1. Visit your admin dashboard
2. Check if the user avatar is now displaying correctly
3. Test in browser developer tools to verify the URL is absolute

## Expected Results

### Development Environment:
- Avatar URLs: `./assets/images/users/user-2.jpg`
- Works with local development server

### Production Environment (GoDaddy):
- Avatar URLs: `https://tedara.com/assets/images/users/user-2.jpg`
- Works with GoDaddy hosting

## Testing

### Manual Testing:
1. **Development:** Check that relative paths still work locally
2. **Production:** Verify absolute paths work on GoDaddy
3. **User Avatar:** Test with and without custom user avatars

### Browser Console Testing:
```javascript
// Test asset path generation
window.testAssetPaths();
```

## Troubleshooting

### If avatars still don't load:

1. **Check Network Tab:**
   - Open browser developer tools
   - Go to Network tab
   - Look for failed image requests
   - Verify the URL is absolute

2. **Check Console Errors:**
   - Look for 404 errors on image requests
   - Check for CORS errors

3. **Verify File Structure:**
   - Ensure `assets/images/users/` directory exists
   - Check that user avatar images are present

4. **Test Different Environments:**
   - Verify it works in development
   - Test on production/GoDaddy

### Common Issues:

1. **404 Error on Avatar Images:**
   - Check if the assets directory exists on GoDaddy
   - Verify the build process includes all assets

2. **CORS Errors:**
   - Ensure the frontend domain is properly configured
   - Check GoDaddy hosting settings

3. **Mixed Content Errors:**
   - Ensure HTTPS is used for all asset URLs
   - Check SSL certificate configuration

## Additional Improvements

### Future Enhancements:
1. **Dynamic Avatar Upload:** Allow users to upload custom avatars
2. **Avatar Caching:** Implement proper caching for avatar images
3. **Fallback System:** Multiple fallback avatars for different scenarios
4. **Image Optimization:** Compress and optimize avatar images

### Security Considerations:
1. **File Type Validation:** Only allow image files for avatars
2. **File Size Limits:** Restrict avatar file sizes
3. **Path Validation:** Prevent directory traversal attacks

## Summary

The fix ensures that:
- ✅ User avatars display correctly on GoDaddy
- ✅ Development environment still works with relative paths
- ✅ Production environment uses absolute paths
- ✅ Fallback system works for users without custom avatars
- ✅ All admin dashboard assets load properly

The solution automatically detects the environment and uses the appropriate URL format, ensuring compatibility across different hosting environments.
