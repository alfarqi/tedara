# Store Registration Feature

## Overview

The Tedara E-commerce platform now supports store registration functionality, allowing users to register as store owners and create their own stores. This feature includes both user registration with store creation and separate store registration for existing users.

## Features Implemented

### 1. User Registration with Store Creation
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user and optionally create a store in one step
- **Authentication**: Not required (public endpoint)
- **Rate Limiting**: 3 attempts per 5 minutes

#### Request Body
```json
{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+966501234567",
    "password": "password123",
    "password_confirmation": "password123",
    "location": "Riyadh, Saudi Arabia",
    "role": "store_owner",
    "store_name": "My Store",
    "store_domain": "my-store",
    "store_description": "My amazing store",
    "store_currency": "SAR",
    "store_language": "ar",
    "store_timezone": "Asia/Riyadh"
}
```

#### Response
```json
{
    "message": "Registration successful",
    "user": {
        "id": 1,
        "name": "John Smith",
        "email": "john.smith@example.com",
        "role": "store_owner",
        "status": "active",
        "phone": "+966501234567",
        "location": "Riyadh, Saudi Arabia",
        "force_password_change": false,
        "email_verified_at": "2024-01-01T00:00:00.000000Z"
    },
    "store": {
        "id": 1,
        "name": "My Store",
        "domain": "my-store",
        "status": "active"
    },
    "token": "1|abc123..."
}
```

### 2. Store Registration for Existing Users
- **Endpoint**: `POST /api/auth/register-store`
- **Description**: Register a new store for existing store owners
- **Authentication**: Required (Bearer token)
- **Authorization**: Store owners only

#### Request Body
```json
{
    "name": "New Store",
    "domain": "new-store",
    "description": "A new store for existing user",
    "currency": "SAR",
    "language": "ar",
    "timezone": "Asia/Riyadh",
    "logo": "/uploads/stores/logo.png"
}
```

#### Response
```json
{
    "message": "Store registered successfully",
    "store": {
        "id": 2,
        "name": "New Store",
        "domain": "new-store",
        "status": "active",
        "description": "A new store for existing user",
        "currency": "SAR",
        "language": "ar",
        "timezone": "Asia/Riyadh",
        "logo": "/uploads/stores/logo.png",
        "created_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

### 3. Store Management API
- **Base Endpoint**: `/api/stores`
- **Authentication**: Required (Bearer token)
- **Authorization**: Based on user role and store ownership

#### Available Endpoints

| Method | Endpoint | Description | Authorization |
|--------|----------|-------------|---------------|
| GET | `/api/stores` | List stores | Super Admin, Store Owner, Store Manager |
| POST | `/api/stores` | Create store | Super Admin, Store Owner |
| GET | `/api/stores/{id}` | Get store details | Super Admin, Store Owner (own stores) |
| PUT | `/api/stores/{id}` | Update store | Super Admin, Store Owner (own stores) |
| DELETE | `/api/stores/{id}` | Delete store | Super Admin only |
| GET | `/api/stores/{id}/statistics` | Get store statistics | Super Admin, Store Owner (own stores) |
| GET | `/api/stores/{id}/settings` | Get store settings | Super Admin, Store Owner (own stores) |
| PUT | `/api/stores/{id}/settings` | Update store settings | Super Admin, Store Owner (own stores) |

#### Query Parameters for Store Listing
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15, max: 100)
- `sort`: Sort field (prefix with `-` for desc)
- `search`: Search in name, domain, description
- `filter[status]`: Filter by status (active, inactive, suspended)
- `filter[currency]`: Filter by currency
- `filter[language]`: Filter by language
- `filter[owner_id]`: Filter by owner ID (Super Admin only)
- `from`: Start date for date range filter
- `to`: End date for date range filter

#### Store Statistics Response
```json
{
    "data": {
        "total_products": 150,
        "total_orders": 45,
        "total_customers": 89,
        "total_revenue": 12500.50,
        "pending_orders": 12,
        "low_stock_products": 8
    },
    "meta": {
        "message": "Store statistics retrieved successfully",
        "status": "success"
    }
}
```

## Validation Rules

### User Registration
- `name`: Required, string, max 255 characters
- `email`: Required, valid email, unique
- `phone`: Required, string, max 20 characters
- `password`: Required, string, min 8 characters, confirmed
- `location`: Optional, string, max 100 characters
- `role`: Optional, in: customer, store_owner (defaults to store_owner)

### Store Registration (during user registration)
- `store_name`: Optional, string, max 255 characters (will be filled during onboarding)
- `store_domain`: Optional, string, max 255 characters, unique (will be filled during onboarding)
- `store_description`: Optional, string, max 1000 characters
- `store_currency`: Optional, string, max 10 characters
- `store_language`: Optional, string, max 10 characters
- `store_timezone`: Optional, string, max 50 characters

### Store Creation/Update
- `name`: Required, string, max 255 characters
- `domain`: Required, string, max 255 characters, unique
- `description`: Optional, string, max 1000 characters
- `currency`: Optional, string, max 10 characters
- `language`: Optional, string, max 10 characters
- `timezone`: Optional, string, max 50 characters
- `logo`: Optional, string, max 500 characters
- `status`: Optional, in: active, inactive, suspended

## Authorization Policies

### Store Policy
- **viewAny**: Super Admin, Store Owner, Store Manager
- **view**: Super Admin (all stores), Store Owner (own stores), Store Manager (all stores)
- **create**: Super Admin, Store Owner
- **update**: Super Admin (all stores), Store Owner (own stores)
- **delete**: Super Admin only

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'store_owner', 'store_manager', 'customer', 'support') DEFAULT 'store_owner',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    phone VARCHAR(20) NULL,
    location VARCHAR(100) NULL,
    avatar VARCHAR(255) NULL,
    force_password_change BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Stores Table
```sql
CREATE TABLE stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    settings JSON NULL,
    logo VARCHAR(255) NULL,
    description TEXT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    language VARCHAR(10) DEFAULT 'ar',
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_status (owner_id, status),
    INDEX idx_domain (domain)
);
```

## Error Handling

### Rate Limiting
- Registration attempts are limited to 3 per 5 minutes per IP
- Login attempts are limited to 5 per 5 minutes per IP

### Validation Errors
```json
{
    "data": null,
    "meta": {
        "message": "Validation failed",
        "status": "error",
        "errors": {
            "email": ["The email field is required."],
            "store_domain": ["This domain is already in use."]
        }
    }
}
```

### Authorization Errors
```json
{
    "data": null,
    "meta": {
        "message": "You are not authorized to create stores.",
        "status": "error"
    }
}
```

## Testing

### Postman Collection
The updated Postman collection includes:
- User registration with store creation
- Store registration for existing users
- Complete store management API endpoints
- All query parameters and filters
- Example request bodies

### Test Scenarios
1. **New User Registration as Store Owner (Basic)**
   - Register without store fields
   - Verify user is created with store_owner role
   - Verify no store is created (will be created during onboarding)

2. **New User Registration as Store Owner (With Store Info)**
   - Register with store fields
   - Verify both user and store are created
   - Verify user gets store_owner role

3. **Existing User Store Registration**
   - Login as store owner
   - Register additional store
   - Verify store is associated with user

4. **Store Management**
   - List stores (filtered by user role)
   - Create, update, delete stores
   - Access store statistics and settings

## Security Considerations

1. **Rate Limiting**: Prevents abuse of registration endpoints
2. **Input Validation**: Comprehensive validation for all inputs
3. **Authorization**: Role-based access control for all operations
4. **Data Isolation**: Store owners can only access their own stores
5. **Unique Constraints**: Domain names must be unique across all stores
6. **Password Security**: Passwords are hashed using Laravel's bcrypt

## Frontend Integration

### Registration Flow
1. User fills out registration form
2. If selecting "Store Owner" role, show additional store fields
3. Submit registration with all data
4. Handle response (user + store data + token)
5. Redirect to dashboard or store setup

### Store Management
1. Store owners can view their stores
2. Create additional stores
3. Manage store settings and statistics
4. Upload store logos and assets

## Future Enhancements

1. **Store Templates**: Pre-configured store setups
2. **Store Categories**: Categorize stores by type
3. **Store Analytics**: Advanced analytics and reporting
4. **Multi-store Management**: Dashboard for managing multiple stores
5. **Store Verification**: Admin approval process for new stores
6. **Store Migration**: Tools for migrating existing stores





