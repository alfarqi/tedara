#!/bin/bash

# Build and Deploy Script for Storefront
echo "🚀 Building and Deploying Storefront..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the storefront directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist' directory"
    echo ""
    echo "📋 Next steps:"
    echo "1. Upload the contents of the 'dist' directory to your GoDaddy hosting"
    echo "2. Make sure to upload to the correct directory (usually public_html or similar)"
    echo "3. Test the mobile debug panel on your mobile device"
    echo ""
    echo "🔍 To test:"
    echo "1. Open mobile browser"
    echo "2. Navigate to https://tedara.com/fasool/"
    echo "3. Look for the red debug bar at the top of the screen"
    echo "4. Tap 'SHOW' to see debug information"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi
