# 🔧 Storefront Troubleshooting Guide

## ✅ Current Status

- **Laravel Backend**: Running on `http://localhost:8000` ✅
- **Storefront Frontend**: Running on `http://localhost:5175` ✅

## 🧪 Test URLs (Updated Port)

- **Home**: http://localhost:5175/feras-store/
- **Catalog**: http://localhost:5175/feras-store/catalog
- **About**: http://localhost:5175/feras-store/about
- **Contact**: http://localhost:5175/feras-store/contact

## 🐛 Common Issues & Solutions

### Issue 1: Blank Page
**Symptoms**: Page loads but shows blank content

**Solutions**:
1. **Check Browser Console** (F12 → Console tab)
   - Look for JavaScript errors
   - Check for network errors (API calls failing)

2. **Check Network Tab** (F12 → Network tab)
   - Verify API calls are being made
   - Check if API responses are successful

3. **Verify Servers are Running**:
   ```bash
   # Check Laravel server
   curl http://localhost:8000/api/test
   
   # Check storefront server
   curl http://localhost:5175
   ```

### Issue 2: Port Already in Use
**Symptoms**: `Port 5173 is in use, trying another one...`

**Solutions**:
1. **Use the new port** (e.g., 5175 instead of 5173)
2. **Kill existing processes**:
   ```bash
   # Find process using port 5173
   netstat -ano | findstr :5173
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

### Issue 3: API Connection Issues
**Symptoms**: "Failed to fetch" errors in console

**Solutions**:
1. **Check Laravel server is running**:
   ```bash
   cd backend
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Check CORS configuration** in Laravel
3. **Verify API endpoints**:
   ```bash
   curl http://localhost:8000/api/storefront/feras-store/theme
   ```

### Issue 4: Node.js Version Warning
**Symptoms**: "Vite requires Node.js version 20.19+ or 22.12+"

**Solutions**:
1. **Ignore the warning** - it still works with Node.js 20.18.3
2. **Upgrade Node.js** if you want to remove the warning

## 🔍 Debug Steps

### Step 1: Check Browser Console
1. Open the storefront URL
2. Press F12 to open developer tools
3. Go to Console tab
4. Look for any red error messages

### Step 2: Check Network Requests
1. Go to Network tab in developer tools
2. Refresh the page
3. Look for failed API requests (red entries)
4. Check the response of API calls

### Step 3: Test API Directly
```bash
# Test theme API
curl http://localhost:8000/api/storefront/feras-store/theme

# Test home page API
curl http://localhost:8000/api/storefront/feras-store/page/home

# Test products API
curl http://localhost:8000/api/storefront/feras-store/products
```

### Step 4: Check Server Logs
```bash
# Laravel logs
cd backend
tail -f storage/logs/laravel.log

# Check if there are any errors
```

## 🚀 Quick Start Commands

### Start Laravel Server
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

### Start Storefront Server
```bash
cd storefront
npm run dev
```

### Test API
```bash
curl http://localhost:8000/api/storefront/feras-store/theme
```

## 📱 Expected Behavior

When everything is working correctly, you should see:

1. **Loading Spinner**: Brief loading animation while fetching data
2. **Home Page**: Hero section with "Welcome to Feras Store"
3. **Purple Theme**: #6f42c1 primary color throughout
4. **Navigation**: Header with store name and menu
5. **Footer**: Contact information and social links
6. **Responsive**: Works on mobile and desktop

## 🆘 If Still Having Issues

1. **Clear Browser Cache**: Ctrl+Shift+R (hard refresh)
2. **Try Different Browser**: Chrome, Firefox, Edge
3. **Check Firewall**: Ensure ports 8000 and 5175 are not blocked
4. **Restart Servers**: Stop and restart both Laravel and storefront servers

## 📞 Quick Test

Run this command to test everything at once:

```bash
# Test Laravel API
curl http://localhost:8000/api/storefront/feras-store/theme

# Test storefront (should return HTML)
curl http://localhost:5175/feras-store/
```

If both commands return data, everything is working correctly!











