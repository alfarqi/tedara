# Mobile Debug Panel - Visual Debugging for Mobile Devices

## Problem
Mobile browsers often hide console logs by default, making it difficult to see debug errors and troubleshoot issues on mobile devices.

## Solution
A visual debug panel that appears directly on the mobile screen, capturing and displaying all debug logs in real-time.

## Features

### 📱 Mobile-Only Display
- Only appears on mobile devices
- Automatically detects mobile browsers
- Hidden on desktop for clean experience

### 🔍 Real-Time Logging
- Captures all console logs
- Shows mobile-specific debug messages
- Displays errors, warnings, and info messages
- Real-time updates as you navigate

### 🎛️ Interactive Controls
- **Toggle Panel**: Show/hide the debug panel
- **Auto-scroll**: Automatically scroll to latest logs
- **Clear Logs**: Clear all captured logs
- **Expand/Collapse**: Resize the panel
- **Close**: Hide the panel completely

### 📊 Device Information
- Device type (Mobile/Desktop)
- Current URL
- Timestamp
- User agent information

## How to Use

### 1. Access the Debug Panel
1. **Open your mobile browser**
2. **Navigate to** `https://tedara.com/fasool/`
3. **Look for the blue debug button** in the bottom-right corner
4. **Tap the button** to open the debug panel

### 2. View Debug Information
The panel will show:
- **Device Info**: Mobile device detection, URL, timestamp
- **Debug Logs**: All console messages with timestamps
- **Error Messages**: Any errors that occur
- **API Calls**: Network request information

### 3. Debug Log Types
- **ℹ️ Info**: General information and debug messages
- **⚠️ Warning**: Warning messages
- **❌ Error**: Error messages and exceptions
- **📝 Debug**: Detailed debugging information

### 4. Panel Controls
- **📍 Auto-scroll**: Toggle automatic scrolling to latest logs
- **🗑️ Clear**: Clear all captured logs
- **📈/📉 Expand/Collapse**: Resize the panel
- **✕ Close**: Hide the debug panel

## What You'll See

### Successful Load
```
📱 [MOBILE DEBUG] useTenant hook called
📱 [MOBILE DEBUG] Fetching theme for tenant
📱 [MOBILE DEBUG] Theme API Response Status: 200
📱 [MOBILE DEBUG] Theme data received successfully
```

### Error Scenarios
```
❌ [MOBILE ERROR] Failed to fetch theme: 404 Not Found
❌ [MOBILE ERROR] No tenant specified
❌ [MOBILE ERROR] API Error: 500 Internal Server Error
```

### Device Information
```
Device: Mobile
URL: /fasool/
Time: 2:30:45 PM
```

## Troubleshooting

### If Debug Panel Doesn't Appear:
1. **Check if you're on mobile**: Panel only shows on mobile devices
2. **Refresh the page**: Sometimes needed for first load
3. **Check browser compatibility**: Works on modern mobile browsers

### If No Logs Appear:
1. **Navigate around the app**: Logs are generated as you use the app
2. **Check if JavaScript is enabled**: Panel requires JavaScript
3. **Try different pages**: Some pages may have more debug activity

### If Logs Are Empty:
1. **Wait a moment**: Logs may take time to appear
2. **Interact with the app**: Click buttons, navigate pages
3. **Check network connection**: API calls generate debug logs

## Technical Details

### Files Modified:
- `storefront/src/components/MobileDebugPanel.tsx` - Main debug panel component
- `storefront/src/theme/classic/pages/Home.tsx` - Added debug panel to home page
- `storefront/src/utils/mobileDebug.ts` - Mobile debugging utilities
- `storefront/src/utils/testMobileDebug.ts` - Test script for debugging

### How It Works:
1. **Console Override**: Intercepts console.log, console.error, console.warn
2. **Mobile Detection**: Uses user agent to detect mobile devices
3. **Real-time Updates**: Updates the panel as new logs arrive
4. **Local Storage**: Logs are stored in component state (not persistent)

### Performance:
- **Lightweight**: Minimal impact on app performance
- **Auto-cleanup**: Keeps only last 50 logs to prevent memory issues
- **Mobile-optimized**: Designed specifically for mobile screens

## Benefits

### ✅ Visual Debugging:
- See debug information directly on mobile screen
- No need to open developer tools
- Real-time log monitoring

### ✅ Better Troubleshooting:
- Immediate feedback on errors
- Device-specific information
- Easy log management

### ✅ User-Friendly:
- Simple tap-to-open interface
- Clear log categorization
- Intuitive controls

## Example Usage

### Scenario: Store Not Found Error
1. **Open mobile browser** to `https://tedara.com/fasool/`
2. **Tap debug button** if you see "store not found"
3. **Check logs** for:
   - Tenant detection status
   - API call results
   - Error messages
4. **Use information** to identify the issue

### Scenario: API Issues
1. **Open debug panel**
2. **Navigate to different pages**
3. **Watch for API call logs**
4. **Check for error responses**

## Summary

The Mobile Debug Panel provides a visual way to see debug information directly on your mobile device, making it much easier to troubleshoot issues like the "store not found" error. Simply tap the blue debug button in the bottom-right corner to see what's happening behind the scenes!
