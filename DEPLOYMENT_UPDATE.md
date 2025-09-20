# Deploy Updated Storefront to Fix API URLs

## The Problem
The deployed storefront on Netlify is still using the old build with hardcoded `localhost:8000` URLs, causing CORS errors when accessing stores.

## The Solution
Deploy the updated build that uses the production API URLs.

## Steps to Deploy

### Option 1: Automatic Deployment (if connected to Git)
If your Netlify site is connected to your Git repository:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Fix storefront API URLs to use production backend"
   git push
   ```

2. **Netlify will automatically build and deploy** the updated version

### Option 2: Manual Deployment
If you need to deploy manually:

1. **Build the updated version:**
   ```bash
   npm run build:combined
   ```

2. **Go to your Netlify site dashboard**

3. **Go to "Deploys" tab**

4. **Click "Trigger deploy" → "Deploy site"**

5. **Or drag and drop the `dist` folder** to the deploy area

### Option 3: Update Build Settings (if needed)
If the build settings are incorrect:

1. **Go to Site settings → Build & deploy → Build settings**

2. **Update the settings:**
   - **Base directory**: `.` (root)
   - **Build command**: `npm run build:combined`
   - **Publish directory**: `dist`

3. **Save and trigger a new deploy**

## Verify the Fix

After deployment, test these URLs:

1. **Visit**: `https://tedara.com/sameer`
2. **Check browser console** - should see:
   ```
   🚀 Storefront Production API URL: https://api.tedara.com/backend/public
   ```
3. **Check Network tab** - API calls should go to:
   ```
   https://api.tedara.com/backend/public/api/storefront/sameer/theme
   ```

## Expected Results

- ✅ **No more CORS errors** in browser console
- ✅ **API calls go to production backend** instead of localhost
- ✅ **Store pages load correctly** with theme and products
- ✅ **All storefront functionality works** (auth, orders, etc.)

## Troubleshooting

### If still seeing localhost URLs:
1. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
2. **Check if deployment completed** in Netlify dashboard
3. **Verify build settings** are correct
4. **Check environment variables** in Netlify:
   - `VITE_API_URL=https://api.tedara.com/backend/public`

### If API calls still fail:
1. **Check backend CORS configuration** is working
2. **Test API directly**: `https://api.tedara.com/backend/public/api/storefront/sameer/theme`
3. **Check backend logs** for any errors

## Current Status
- ✅ **Code fixed** - All hardcoded localhost URLs replaced with production API
- ✅ **Build tested** - Combined build works correctly
- ⏳ **Deployment needed** - Updated build needs to be deployed to Netlify

**Next step: Deploy the updated build to Netlify to fix the CORS errors!**
