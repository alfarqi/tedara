# Home Page API Troubleshooting Guide - GoDaddy

## Common Issues and Solutions

### 1. **API Not Accessible (404/500 Errors)**

#### Problem: Getting 404 or 500 errors when accessing API endpoints
#### Solutions:
- **Check .htaccess file**: Ensure your `.htaccess` file in the backend directory is properly configured
- **Verify file structure**: Make sure `public/index.php` exists and is accessible
- **Check GoDaddy configuration**: Ensure mod_rewrite is enabled on your GoDaddy hosting
- **Test direct access**: Try accessing `https://api.tedara.com/backend/public/index.php` directly

#### Quick Fix:
```bash
# Test if Laravel is working
curl -I https://api.tedara.com/backend/public/index.php
```

### 2. **CORS Issues**

#### Problem: Frontend can't access API due to CORS errors
#### Solutions:
- **Check CORS headers**: Verify `public/index.php` has proper CORS headers
- **Update allowed origins**: Add your frontend domain to the allowed origins list
- **Test CORS endpoint**: Use `/api/cors-test` endpoint to verify CORS is working

#### Current CORS Configuration:
```php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5176', 
    'http://localhost:3000',
    'http://localhost:8000',
    'http://tedara.local',
    'https://tedara.com',
    'https://www.tedara.com',
    'https://tedara.netlify.app',
];
```

### 3. **Tenant Not Found (404)**

#### Problem: Getting "Tenant not found" errors
#### Solutions:
- **Check tenant exists**: Verify the tenant handle exists in the database
- **Check tenant status**: Ensure tenant status is 'active'
- **Verify tenant handle**: Make sure you're using the correct tenant handle (case-sensitive)

#### Database Check:
```sql
SELECT * FROM tenants WHERE handle = 'fashion-store' AND status = 'active';
```

### 4. **Home Page Not Found**

#### Problem: Home page returns 404 even when tenant exists
#### Solutions:
- **Check page exists**: Verify home page exists for the tenant
- **Check page status**: Ensure page is published/active
- **Verify slug**: Make sure the page slug is 'home'

#### Database Check:
```sql
SELECT * FROM storefront_pages 
WHERE tenant_id = (SELECT id FROM tenants WHERE handle = 'fashion-store') 
AND slug = 'home' AND is_home = 1;
```

### 5. **Database Connection Issues**

#### Problem: API returns database connection errors
#### Solutions:
- **Check database credentials**: Verify `.env` file has correct database settings
- **Test database connection**: Use the debug endpoints to test database connectivity
- **Check GoDaddy database**: Ensure your GoDaddy database is active and accessible

#### Test Database:
```bash
# Test database connectivity
curl https://api.tedara.com/backend/public/api/debug-questions-ratings
```

### 6. **Slow Response Times**

#### Problem: API responses are slow (>3 seconds)
#### Solutions:
- **Check database queries**: Optimize database queries and add indexes
- **Enable caching**: Implement Redis or file-based caching
- **Optimize images**: Compress and optimize product images
- **Check server resources**: Monitor GoDaddy server performance

### 7. **JSON Parsing Errors**

#### Problem: Frontend gets JSON parsing errors
#### Solutions:
- **Check response format**: Ensure API returns valid JSON
- **Handle errors properly**: Check for error responses in your frontend code
- **Validate response**: Use the test script to verify JSON format

### 8. **Authentication Issues**

#### Problem: Protected endpoints return 401/403 errors
#### Solutions:
- **Check token format**: Ensure Bearer token is properly formatted
- **Verify token validity**: Check if token is expired or invalid
- **Check middleware**: Verify authentication middleware is working

## Testing Checklist

### Before Testing:
- [ ] GoDaddy hosting is active
- [ ] Database is accessible
- [ ] Laravel application is deployed
- [ ] .htaccess file is configured
- [ ] CORS headers are set

### During Testing:
- [ ] Test basic API connectivity (`/api/test`)
- [ ] Test CORS configuration (`/api/cors-test`)
- [ ] Test tenant resolution
- [ ] Test home page endpoint
- [ ] Test theme endpoint
- [ ] Test products endpoint

### After Testing:
- [ ] Verify response times are acceptable
- [ ] Check JSON response format
- [ ] Test from different origins (CORS)
- [ ] Monitor error logs

## Quick Diagnostic Commands

### Test API Connectivity:
```bash
curl -I https://api.tedara.com/backend/public/api/test
```

### Test CORS:
```bash
curl -H "Origin: https://tedara.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.tedara.com/backend/public/api/cors-test
```

### Test Home Page:
```bash
curl -H "Accept: application/json" \
     https://api.tedara.com/backend/public/api/storefront/fashion-store/page/home
```

### Test Database:
```bash
curl https://api.tedara.com/backend/public/api/debug-questions-ratings
```

## GoDaddy-Specific Issues

### 1. **File Permissions**
- Ensure PHP files have correct permissions (644)
- Check that directories are writable (755)

### 2. **PHP Version**
- Verify you're using a supported PHP version (7.4+)
- Check PHP extensions are enabled (PDO, JSON, etc.)

### 3. **Memory Limits**
- Increase PHP memory limit if needed
- Monitor memory usage during API calls

### 4. **SSL Certificate**
- Ensure SSL certificate is properly configured
- Test both HTTP and HTTPS endpoints

## Emergency Recovery

### If API is completely down:
1. Check GoDaddy hosting status
2. Verify database connectivity
3. Check Laravel logs in `storage/logs/`
4. Test with a simple PHP file
5. Contact GoDaddy support if needed

### If specific endpoints fail:
1. Check route definitions in `routes/api-storefront.php`
2. Verify controller methods exist
3. Check middleware configuration
4. Test with debug endpoints

## Support Resources

- **Laravel Documentation**: https://laravel.com/docs
- **GoDaddy Support**: https://www.godaddy.com/help
- **API Testing Tools**: Postman, Insomnia, cURL
- **Browser Developer Tools**: Network tab for debugging
