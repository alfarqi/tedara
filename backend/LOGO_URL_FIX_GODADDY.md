# Logo URL Fix for GoDaddy Hosting

## Problem Description
Store logos are not displaying correctly on GoDaddy hosting. The issue is that logo URLs are being generated as relative paths instead of full URLs, causing the "Could not load the image" error.

**Example of broken URL:**
```
/uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg
```

**Correct URL should be:**
```
https://api.tedara.com/backend/public/storage/uploads/store/logos/2025/09/screenshot-13_1758554814_jdyzkwOZ.jpg
```

## Root Cause
The issue is caused by:
1. Incorrect filesystem configuration in `config/filesystems.php`
2. URL generation methods not handling GoDaddy's path structure
3. Missing `/backend/public/` prefix in storage URLs

## Solution Implemented

### 1. Updated Filesystem Configuration
**File:** `config/filesystems.php`
```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/backend/public/storage', // Added /backend/public/ prefix
    'visibility' => 'public',
    'throw' => false,
    'report' => false,
],
```

### 2. Created URL Helper Class
**File:** `app/Helpers/UrlHelper.php`
- Centralized URL generation logic
- Handles different path formats
- Specifically designed for GoDaddy hosting structure

### 3. Updated Controllers
**Files Updated:**
- `app/Http/Controllers/Api/StoreController.php`
- `app/Http/Controllers/Api/Storefront/ThemeController.php`

**Changes:**
- Replaced old `buildLogoUrl()` methods with `UrlHelper::buildLogoUrl()`
- Added proper imports for the UrlHelper class

## Deployment Steps

### Step 1: Upload Files to GoDaddy
Upload these modified files to your GoDaddy hosting:
- `config/filesystems.php`
- `app/Helpers/UrlHelper.php`
- `app/Http/Controllers/Api/StoreController.php`
- `app/Http/Controllers/Api/Storefront/ThemeController.php`

### Step 2: Clear Laravel Cache
Run these commands on GoDaddy (via SSH or cPanel Terminal):
```bash
cd /path/to/your/laravel/app
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 3: Create Storage Symbolic Link
```bash
php artisan storage:link
```

### Step 4: Test the Fix
1. Upload the test script: `test_logo_urls.php` to your `backend/public/` directory
2. Visit: `https://api.tedara.com/backend/public/test_logo_urls.php`
3. Check if logo URLs are being generated correctly

### Step 5: Verify Logo Display
1. Go to your admin panel
2. Check if store logos are now displaying correctly
3. Test uploading a new logo to ensure it works

## Environment Configuration

Make sure your `.env` file has the correct APP_URL:
```env
APP_URL=https://api.tedara.com
```

## Testing

### Test Script
Use the provided test script to verify the fix:
```bash
# Upload test_logo_urls.php to backend/public/
# Visit: https://api.tedara.com/backend/public/test_logo_urls.php
```

### Manual Testing
1. **Upload a new logo** through the admin panel
2. **Check the generated URL** in the database or API response
3. **Verify the logo displays** in the admin interface
4. **Test on different pages** (store settings, dashboard, etc.)

## Troubleshooting

### If logos still don't load:

1. **Check file permissions:**
   ```bash
   chmod -R 755 storage/
   chmod -R 755 public/storage/
   ```

2. **Verify symbolic link:**
   ```bash
   ls -la public/storage
   # Should show: storage -> ../storage/app/public
   ```

3. **Check .htaccess file:**
   Ensure your `.htaccess` file in the `backend/` directory includes:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_URI} !^/public/
   RewriteRule ^(.*)$ public/$1 [L]
   ```

4. **Test direct file access:**
   Try accessing a logo file directly:
   ```
   https://api.tedara.com/backend/public/storage/uploads/store/logos/2025/09/your-logo.jpg
   ```

### Common Issues:

1. **404 Error on Logo URLs:**
   - Check if the file actually exists in the storage directory
   - Verify the symbolic link is created correctly

2. **403 Forbidden Error:**
   - Check file permissions
   - Ensure the storage directory is accessible

3. **Still getting relative URLs:**
   - Clear Laravel cache
   - Check if the UrlHelper is being used correctly

## File Structure After Fix

```
backend/
├── app/
│   └── Helpers/
│       └── UrlHelper.php (NEW)
├── config/
│   └── filesystems.php (UPDATED)
├── public/
│   └── storage -> ../storage/app/public (SYMBOLIC LINK)
└── storage/
    └── app/
        └── public/
            └── uploads/
                └── store/
                    └── logos/
                        └── 2025/
                            └── 09/
                                └── your-logo.jpg
```

## Expected Results

After implementing this fix:
- ✅ Store logos will display correctly in the admin panel
- ✅ Logo URLs will be full URLs instead of relative paths
- ✅ New logo uploads will work correctly
- ✅ Existing logos will be accessible via the correct URLs

## Support

If you continue to experience issues:
1. Run the test script and share the results
2. Check the Laravel logs in `storage/logs/`
3. Verify your GoDaddy hosting configuration
4. Test with a simple image upload to isolate the issue
