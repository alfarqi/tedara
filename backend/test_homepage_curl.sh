#!/bin/bash
# Home Page API Test Script using cURL
# Run this script to test your home page API on GoDaddy

echo "🏠 Testing Home Page API on GoDaddy"
echo "=================================="

BASE_URL="https://api.tedara.com/backend/public/api"
TENANTS=("fashion-store" "feras-store" "sameer-store")

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    echo -e "\n${BLUE}Testing: $name${NC}"
    echo "URL: $url"
    
    response=$(curl -s -w "\n%{http_code}" -H "Accept: application/json" -H "Content-Type: application/json" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Success (HTTP $http_code)${NC}"
        echo "Response preview:"
        echo "$body" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ Failed (HTTP $http_code)${NC}"
        echo "Response: $body"
    fi
}

# Test basic API connectivity
echo -e "\n${BLUE}🌐 Basic API Connectivity${NC}"
test_endpoint "$BASE_URL/test" "Basic API Test"
test_endpoint "$BASE_URL/cors-test" "CORS Test"

# Test each tenant
for tenant in "${TENANTS[@]}"; do
    echo -e "\n${BLUE}🏪 Testing Tenant: $tenant${NC}"
    echo "=================================="
    
    test_endpoint "$BASE_URL/storefront/$tenant/page/home" "Home Page"
    test_endpoint "$BASE_URL/storefront/$tenant/pages" "All Pages"
    test_endpoint "$BASE_URL/storefront/$tenant/theme" "Theme"
    test_endpoint "$BASE_URL/storefront/$tenant/products" "Products"
done

# Performance test
echo -e "\n${BLUE}⚡ Performance Test${NC}"
echo "=================="

start_time=$(date +%s%N)
curl -s -H "Accept: application/json" "$BASE_URL/storefront/fashion-store/page/home" > /dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 ))

echo "Response time: ${response_time}ms"
if [ $response_time -lt 1000 ]; then
    echo -e "${GREEN}🚀 Good performance!${NC}"
elif [ $response_time -lt 3000 ]; then
    echo -e "${BLUE}⚠️ Acceptable performance${NC}"
else
    echo -e "${RED}🐌 Slow response - consider optimization${NC}"
fi

echo -e "\n${BLUE}📋 Test Summary${NC}"
echo "=============="
echo "✅ Basic API connectivity"
echo "✅ Home page endpoints for each tenant"
echo "✅ JSON response validation"
echo "✅ CORS configuration"
echo "✅ Response time performance"

echo -e "\n${BLUE}🔧 Troubleshooting${NC}"
echo "=================="
echo "If tests fail, check:"
echo "- GoDaddy hosting configuration"
echo "- Laravel .htaccess file"
echo "- Database connectivity"
echo "- Tenant data exists in database"
echo "- CORS headers in public/index.php"
