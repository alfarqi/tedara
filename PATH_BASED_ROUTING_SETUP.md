# Path-Based Routing Setup Guide

## Overview
This setup allows both the admin dashboard and storefront to be served from the same domain using path-based routing:

- `https://tedara.com/admin` → Admin dashboard (for store owners)
- `https://tedara.com/sameer` → Sameer's store (for customers)
- `https://tedara.com/feras` → Feras's store (for customers)

## What I've Configured

### 1. Updated `netlify.toml`
- Combined build process for both applications
- Path-based redirects:
  - `/admin/*` → Admin dashboard
  - `/*` → Storefront

### 2. Updated `package.json`
- Added combined build scripts
- `build:combined` - Builds both apps and combines them

### 3. Created `scripts/combine-builds.js`
- Combines both builds into a single `dist` folder
- Admin dashboard goes to `dist/admin/`
- Storefront goes to `dist/` (root)

### 4. Updated Frontend (Admin Dashboard)
- Added `basename="/admin"` to React Router
- All admin routes now work under `/admin` path

### 5. Updated Storefront
- Root path shows welcome page with links to admin and stores
- Tenant routes work as before (e.g., `/sameer`, `/feras`)

## Deployment Steps

### Step 1: Deploy to Netlify
1. Go to your Netlify site settings
2. Update build settings:
   - **Base directory**: `.` (root)
   - **Build command**: `npm run build:combined`
   - **Publish directory**: `dist`

### Step 2: Environment Variables
Make sure these are set in Netlify:
```
VITE_API_URL=https://api.tedara.com/backend/public
```

### Step 3: Test the Setup
After deployment, test these URLs:

#### Admin Dashboard:
- `https://tedara.com/admin` → Should show admin login
- `https://tedara.com/admin/dashboard` → Should show dashboard (after login)

#### Storefront:
- `https://tedara.com/` → Should show welcome page
- `https://tedara.com/sameer` → Should show Sameer's store
- `https://tedara.com/feras` → Should show Feras's store

## File Structure After Build
```
dist/
├── index.html          # Storefront root
├── assets/             # Storefront assets
├── admin/              # Admin dashboard
│   ├── index.html      # Admin root
│   └── assets/         # Admin assets
```

## Troubleshooting

### If Admin Dashboard Doesn't Load:
- Check that `basename="/admin"` is set in frontend/src/App.tsx
- Verify the build process copied files to `dist/admin/`

### If Storefront Doesn't Load:
- Check that storefront build was copied to `dist/` root
- Verify Netlify redirects are working

### If API Calls Fail:
- Check CORS configuration in backend
- Verify `VITE_API_URL` environment variable

## Development
For local development, you'll need to run both applications separately:

```bash
# Terminal 1 - Admin Dashboard
cd frontend
npm run dev

# Terminal 2 - Storefront  
cd storefront
npm run dev
```

- Admin: `http://localhost:5173`
- Storefront: `http://localhost:5174`

## Benefits of This Approach
- ✅ Single domain for everything
- ✅ Easy to manage and deploy
- ✅ SEO-friendly URLs
- ✅ No subdomain configuration needed
- ✅ Cost-effective (single Netlify site)
