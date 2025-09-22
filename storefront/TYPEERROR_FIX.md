# TypeError Fix - Mobile Theme Fetch Error

## Problem Identified
From your mobile screenshot, the error is:
```
Theme fetch error: TypeError {}
```

The tenant detection is working correctly (`CustomerAuthContext - Tenant value: fasool`), but there's a **TypeError** when trying to parse the API response.

## Root Cause
The TypeError typically occurs when:
1. **API returns invalid JSON** (malformed response)
2. **API returns empty response** (network issues)
3. **API returns HTML error page** instead of JSON
4. **Response structure is unexpected** (missing properties)

## Solution Implemented

### 1. Enhanced Error Handling
**File:** `storefront/src/theme/classic/hooks/useTheme.ts`

**Changes Made:**
- Added raw response text logging
- Added JSON parsing error handling
- Added response structure validation
- Added specific TypeError handling

**Key Improvements:**
```typescript
// Before: Direct JSON parsing (causes TypeError)
const data: ThemeResponse = await response.json();

// After: Safe JSON parsing with error handling
const responseText = await response.text();
let data: ThemeResponse;
try {
  data = JSON.parse(responseText);
} catch (parseError) {
  throw new Error(`Invalid JSON response from API: ${parseError}`);
}
```

### 2. Response Validation
```typescript
// Validate response structure
if (!data || typeof data !== 'object') {
  throw new Error('Invalid response structure: not an object');
}

if (!data.data || typeof data.data !== 'object') {
  throw new Error('Invalid response structure: missing data property');
}

if (!data.meta || typeof data.meta !== 'object') {
  throw new Error('Invalid response structure: missing meta property');
}
```

### 3. Specific Error Messages
```typescript
// Handle specific error types
if (err.name === 'TypeError') {
  errorMessage = `TypeError: ${err.message}. This usually means the API response format is unexpected.`;
} else if (err.message.includes('JSON')) {
  errorMessage = `JSON Error: ${err.message}. The API response is not valid JSON.`;
}
```

## Testing

### Step 1: Test the API Response
Visit this URL to check what the API is actually returning:
```
https://api.tedara.com/backend/public/test_theme_api_response.php
```

This will show:
- ✅ Raw API response
- ✅ JSON validity check
- ✅ Response structure validation
- ✅ Formatted JSON output

### Step 2: Deploy the Fix
Upload the updated file to GoDaddy:
- `storefront/src/theme/classic/hooks/useTheme.ts`

### Step 3: Test on Mobile
1. **Open mobile Chrome browser**
2. **Navigate to** `https://tedara.com/fasool/`
3. **Check the error message** - it should now be more specific
4. **Look for debug logs** in the console

## Expected Results

### Before Fix:
```
Theme fetch error: TypeError {}
```

### After Fix:
```
TypeError: Invalid JSON response from API: Unexpected token < in JSON at position 0
```

Or:
```
JSON Error: The API response is not valid JSON
```

## Common Issues & Solutions

### Issue 1: API Returns HTML Error Page
**Symptoms:** `Unexpected token < in JSON at position 0`
**Solution:** Check if the API endpoint is working correctly

### Issue 2: Empty Response
**Symptoms:** `Invalid JSON response from API: Unexpected end of JSON input`
**Solution:** Check network connectivity and API server status

### Issue 3: Malformed JSON
**Symptoms:** `Invalid JSON response from API: Unexpected token`
**Solution:** Check the API response format

### Issue 4: Missing Properties
**Symptoms:** `Invalid response structure: missing data property`
**Solution:** Check if the API response has the expected structure

## Debugging Steps

### 1. Check API Response
Run the test script to see what the API is returning:
```
https://api.tedara.com/backend/public/test_theme_api_response.php
```

### 2. Check Console Logs
The enhanced error handling will now show:
- Raw response length
- JSON parsing status
- Response structure validation
- Specific error messages

### 3. Check Network Tab
In mobile Chrome developer tools:
- Look for the theme API call
- Check the response content
- Verify the content-type header

## Files Modified

1. **`storefront/src/theme/classic/hooks/useTheme.ts`** - Enhanced error handling
2. **`backend/test_theme_api_response.php`** - API response test script

## Deployment Steps

### Step 1: Upload Modified Files
Upload to GoDaddy:
- `storefront/src/theme/classic/hooks/useTheme.ts`

### Step 2: Build and Deploy
```bash
cd storefront
npm run build
# Upload dist folder contents to GoDaddy
```

### Step 3: Test
1. **Run API test:** `https://api.tedara.com/backend/public/test_theme_api_response.php`
2. **Test on mobile:** `https://tedara.com/fasool/`
3. **Check error messages** for more specific information

## Benefits

### ✅ Better Error Messages:
- Specific error descriptions
- Root cause identification
- Debugging information

### ✅ Robust Error Handling:
- Safe JSON parsing
- Response validation
- Graceful error recovery

### ✅ Mobile Debugging:
- Raw response logging
- Structure validation
- Error context information

## Summary

The TypeError fix provides:
1. **Safe JSON parsing** with error handling
2. **Response structure validation** to catch malformed data
3. **Specific error messages** to identify the root cause
4. **Enhanced debugging** for mobile troubleshooting

This will help identify exactly what's causing the TypeError and provide a more robust solution for mobile users.
