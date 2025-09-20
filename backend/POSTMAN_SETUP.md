# Tedara E-commerce API - Postman Collection Setup Guide

## 📋 Overview

This guide will help you set up and use the comprehensive Postman collection for the Tedara E-commerce API. The collection includes all endpoints with proper authentication, request examples, and response formats.

## 🚀 Quick Start

### 1. Import the Collection

1. **Download the Collection**: The collection file is located at `backend/Tedara_API_Collection.postman_collection.json`

2. **Import into Postman**:
   - Open Postman
   - Click "Import" button
   - Select the `Tedara_API_Collection.postman_collection.json` file
   - Click "Import"

### 2. Set Up Environment Variables

1. **Create Environment**:
   - Click the gear icon (⚙️) in the top right
   - Click "Add" to create a new environment
   - Name it "Tedara API Local"

2. **Add Variables**:
   ```
   base_url: http://localhost:8000
   access_token: (leave empty for now)
   ```

3. **Select Environment**: Choose "Tedara API Local" from the environment dropdown

### 3. Start the Laravel Server

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

### 4. Test the API

1. **Health Check**: Run the "API Health Check" request to verify the server is running
2. **Login**: Use the "Login" request to authenticate and get an access token
3. **Set Token**: Copy the token from the login response and set it in the `access_token` environment variable

## 🔐 Authentication Flow

### Step 1: Login
```bash
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "password"
}
```

### Step 2: Extract Token
From the login response, copy the `token` value:
```json
{
    "data": {
        "user": {...},
        "token": "1|abc123..."
    },
    "meta": {...}
}
```

### Step 3: Set Environment Variable
- In Postman, click the environment dropdown
- Select "Tedara API Local"
- Set `access_token` to the token value (without "Bearer ")

### Step 4: Use Protected Endpoints
All subsequent requests will automatically include the authorization header.

## 📚 API Endpoints Overview

### 🔐 Authentication
- **POST** `/api/auth/login` - User login
- **GET** `/api/auth/me` - Get current user
- **POST** `/api/auth/change-password` - Change password
- **POST** `/api/auth/refresh` - Refresh token
- **POST** `/api/auth/logout` - Logout

### 📦 Products (Fully Implemented)
- **GET** `/api/products` - List products (with pagination/filtering)
- **POST** `/api/products` - Create product
- **GET** `/api/products/{id}` - Get product
- **PUT** `/api/products/{id}` - Update product
- **DELETE** `/api/products/{id}` - Delete product
- **POST** `/api/products/bulk-delete` - Bulk delete products

### 📊 Dashboard & Analytics
- **GET** `/api/dashboard` - Dashboard data
- **GET** `/api/reports/sales` - Sales reports (placeholder)

### 🛒 Orders (Placeholder)
- **GET** `/api/orders` - List orders (to be implemented)

### 👥 Customers (Placeholder)
- **GET** `/api/customers` - List customers (to be implemented)

### ⚙️ Store Settings (Placeholder)
- **GET** `/api/store-settings` - Store settings (to be implemented)

### 👨‍💼 Admin (Super Admin Only)
- **GET** `/api/admin/users` - List all users
- **GET** `/api/admin/stores` - List all stores
- **GET** `/api/admin/audit-logs` - Audit logs
- **GET** `/api/admin/analytics` - System analytics

### 🏪 Store Management (Store Owner/Manager)
- **GET** `/api/store/products` - Store products
- **GET** `/api/store/orders` - Store orders
- **GET** `/api/store/customers` - Store customers
- **GET** `/api/store/analytics` - Store analytics

## 🔍 Advanced Features

### Product Filtering Examples

#### Basic Search
```
GET {{base_url}}/api/products?search=laptop
```

#### Pagination
```
GET {{base_url}}/api/products?page=1&per_page=20
```

#### Sorting
```
GET {{base_url}}/api/products?sort=name,-created_at,price
```

#### Status Filter
```
GET {{base_url}}/api/products?filter[status]=active
```

#### Price Range
```
GET {{base_url}}/api/products?filter[min_price]=100&filter[max_price]=1000
```

#### Category Filter
```
GET {{base_url}}/api/products?filter[category_id]=1
```

#### Stock Filter
```
GET {{base_url}}/api/products?filter[in_stock]=true
```

#### Brand Filter
```
GET {{base_url}}/api/products?filter[brand]=Dell
```

#### Tags Filter
```
GET {{base_url}}/api/products?filter[tags]=gaming,portable
```

#### Date Range
```
GET {{base_url}}/api/products?from=2024-01-01&to=2024-12-31
```

#### Combined Filters
```
GET {{base_url}}/api/products?page=1&per_page=15&sort=name&search=laptop&filter[status]=active&filter[min_price]=100&filter[max_price]=1000&filter[category_id]=1&filter[in_stock]=true&filter[brand]=Dell&filter[tags]=gaming,portable&from=2024-01-01&to=2024-12-31
```

### Bulk Operations

#### Bulk Delete Products
```json
POST {{base_url}}/api/products/bulk-delete
{
    "ids": [1, 2, 3, 4, 5]
}
```

## 📝 Request Examples

### Create Product
```json
POST {{base_url}}/api/products
{
    "name": "Gaming Laptop Pro",
    "description": "High-performance gaming laptop with RTX 4080",
    "sku": "LAPTOP-GAMING-001",
    "price": 2499.99,
    "original_price": 2799.99,
    "stock": 25,
    "category_id": 1,
    "status": "active",
    "images": [
        "/assets/images/products/gaming-laptop-1.jpg",
        "/assets/images/products/gaming-laptop-2.jpg"
    ],
    "weight": 2.5,
    "dimensions": "15.6 x 10.2 x 0.9 inches",
    "brand": "GamingTech",
    "tags": ["gaming", "laptop", "high-performance", "rtx"]
}
```

### Update Product
```json
PUT {{base_url}}/api/products/1
{
    "name": "Gaming Laptop Pro Updated",
    "price": 2299.99,
    "stock": 30,
    "status": "active",
    "tags": ["gaming", "laptop", "high-performance", "rtx", "updated"]
}
```

### Change Password
```json
POST {{base_url}}/api/auth/change-password
{
    "current_password": "password",
    "new_password": "newpassword123",
    "new_password_confirmation": "newpassword123"
}
```

## 📊 Response Format

All API responses follow the JSON:API-style format:

### Success Response
```json
{
    "data": {
        "id": 1,
        "name": "Gaming Laptop Pro",
        "price": 2499.99,
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z"
    },
    "meta": {
        "message": "Product created successfully",
        "status": "success"
    }
}
```

### Paginated Response
```json
{
    "data": [...],
    "meta": {
        "message": "Products retrieved successfully",
        "status": "success",
        "pagination": {
            "current_page": 1,
            "per_page": 15,
            "total": 100,
            "last_page": 7,
            "from": 1,
            "to": 15,
            "has_more_pages": true
        }
    }
}
```

### Error Response
```json
{
    "data": null,
    "meta": {
        "message": "Validation failed",
        "status": "error",
        "errors": {
            "name": ["Product name is required."],
            "price": ["Price must be at least 0."]
        }
    }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if the access token is set correctly
   - Verify the token hasn't expired
   - Try logging in again

2. **403 Forbidden**
   - Check user permissions/role
   - Verify the user has access to the requested resource

3. **422 Validation Error**
   - Check request body format
   - Verify all required fields are provided
   - Check field validation rules

4. **404 Not Found**
   - Verify the API endpoint URL
   - Check if the resource exists
   - Ensure proper route configuration

5. **500 Server Error**
   - Check Laravel server logs
   - Verify database connection
   - Check if all migrations are run

### Debug Steps

1. **Check Server Status**:
   ```bash
   curl http://localhost:8000/api/test
   ```

2. **Check Authentication**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password"}'
   ```

3. **Check Database**:
   ```bash
   php artisan migrate:status
   php artisan db:seed
   ```

## 🎯 Testing Workflow

### Recommended Testing Order

1. **Health Check** - Verify API is running
2. **Login** - Get authentication token
3. **Get Current User** - Verify authentication works
4. **List Products** - Test basic GET request
5. **Create Product** - Test POST request
6. **Get Product** - Test GET with ID
7. **Update Product** - Test PUT request
8. **List Products with Filters** - Test advanced features
9. **Bulk Delete** - Test bulk operations
10. **Delete Product** - Test DELETE request
11. **Admin Endpoints** - Test admin-only routes
12. **Store Endpoints** - Test store-specific routes

### Environment Setup for Different Users

#### Super Admin
- Use `admin@example.com` / `password`
- Has access to all endpoints

#### Store Owner
- Use `store@example.com` / `password`
- Has access to store management endpoints

#### Store Manager
- Use `manager@example.com` / `password`
- Has limited access to store endpoints

## 📈 Performance Testing

### Load Testing with Postman

1. **Create a Runner Collection**:
   - Select multiple requests
   - Set iterations and delay
   - Run performance tests

2. **Monitor Response Times**:
   - Check response time in Postman
   - Monitor server resources
   - Test with different data sizes

## 🔒 Security Testing

### Test Cases

1. **Unauthenticated Access**:
   - Remove Authorization header
   - Test protected endpoints

2. **Invalid Token**:
   - Use expired/invalid token
   - Test token validation

3. **Role-based Access**:
   - Test admin endpoints with non-admin user
   - Test store endpoints with different roles

4. **Input Validation**:
   - Test with invalid data
   - Test SQL injection attempts
   - Test XSS attempts

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Postman Learning Center](https://learning.postman.com/)
- [JSON:API Specification](https://jsonapi.org/)

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Laravel logs in `storage/logs/laravel.log`
3. Verify database migrations and seeders
4. Test with curl commands for comparison

---

**Happy Testing! 🚀**






















