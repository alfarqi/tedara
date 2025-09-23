# Google Maps Integration Setup

## Prerequisites

1. **Google Cloud Console Account**: You need a Google Cloud account to get an API key.

2. **Google Maps API Key**: Follow these steps to get your API key:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for Google Maps APIs)

### Step 2: Enable Required APIs
Enable the following APIs in your Google Cloud project:
- **Maps JavaScript API** - For displaying the interactive map
- **Geocoding API** - For converting addresses to coordinates and vice versa
- **Places API** (optional) - For enhanced address search functionality

### Step 3: Create API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to your domain for security

### Step 4: Configure Environment Variables
1. Create a `.env` file in the `storefront` directory
2. Add your API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 5: Test the Integration
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173/ahlam/add-address`
3. You should see an interactive Google Map

## Features

The Google Maps integration includes:

- **Interactive Map**: Click anywhere on the map to set a location
- **Draggable Marker**: Drag the marker to fine-tune the location
- **Address Search**: Search for addresses using the search bar
- **Current Location**: Use your device's GPS to get current location
- **Reverse Geocoding**: Automatically get address from map coordinates
- **Search Results**: Dropdown with search suggestions

## Troubleshooting

### Map Not Loading
- Check if your API key is correctly set in the `.env` file
- Verify that the Maps JavaScript API is enabled
- Check browser console for error messages

### Search Not Working
- Ensure the Geocoding API is enabled
- Check if your API key has the necessary permissions

### Current Location Not Working
- Make sure location services are enabled in your browser
- Check if the site has permission to access location
- Try using HTTPS (required for geolocation in some browsers)

## Security Notes

- Never commit your API key to version control
- Consider restricting your API key to specific domains
- Monitor your API usage in the Google Cloud Console
- Set up billing alerts to avoid unexpected charges






