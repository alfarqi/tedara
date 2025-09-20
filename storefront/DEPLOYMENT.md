# Storefront Deployment Guide

## Overview
The storefront is the public-facing application where customers can view and shop at individual stores. It should be deployed separately from the admin dashboard.

## Current Setup
- **Admin Dashboard**: `https://tedara.com` (Netlify)
- **Backend API**: `https://api.tedara.com` (GoDaddy)
- **Storefront**: Needs to be deployed (this guide)

## Deployment Options

### Option 1: Subdomain Approach (Recommended)
Deploy the storefront to a subdomain like `shop.tedara.com`:

1. **Create a new Netlify site** for the storefront
2. **Connect to the `storefront` directory** in your repository
3. **Set the subdomain** to `shop.tedara.com`
4. **Configure DNS** to point `shop.tedara.com` to Netlify

**Result:**
- `https://tedara.com` → Admin dashboard
- `https://shop.tedara.com/sameer` → Sameer's store
- `https://shop.tedara.com/feras` → Feras's store

### Option 2: Path-based Routing
Modify the main Netlify site to serve both applications:

1. **Update `netlify.toml`** in the root to handle both apps
2. **Configure redirects** to serve the appropriate app based on path
3. **Deploy both apps** to the same Netlify site

**Result:**
- `https://tedara.com/admin` → Admin dashboard
- `https://tedara.com/sameer` → Sameer's store

## Quick Setup (Option 1 - Subdomain)

### Step 1: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Set build settings:
   - **Base directory**: `storefront`
   - **Build command**: `npm run build`
   - **Publish directory**: `storefront/dist`

### Step 2: Configure Environment Variables
In Netlify site settings, add:
```
VITE_API_URL=https://api.tedara.com/backend/public
```

### Step 3: Set Custom Domain
1. In Netlify site settings, go to "Domain management"
2. Add custom domain: `shop.tedara.com`
3. Configure DNS to point to Netlify

### Step 4: Test
- Visit `https://shop.tedara.com/sameer` (should show Sameer's store)
- Visit `https://shop.tedara.com/feras` (should show Feras's store)

## API Configuration
The storefront is configured to use:
- **Development**: `http://localhost:8000`
- **Production**: `https://api.tedara.com/backend/public`

## Store URLs
Once deployed, stores will be accessible at:
- `https://shop.tedara.com/{store-handle}`
- `https://shop.tedara.com/{store-handle}/products`
- `https://shop.tedara.com/{store-handle}/cart`
- etc.

## Troubleshooting
- Ensure the backend API is accessible from the storefront domain
- Check CORS configuration in the backend
- Verify store handles exist in the database
- Check browser console for API errors
