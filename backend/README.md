# Tedara E-commerce Backend API

A Laravel 11 API backend for the Tedara multi-tenant e-commerce platform.

## Features

- **Multi-tenant Architecture**: Support for multiple stores with data isolation
- **API-First Design**: RESTful API endpoints for all operations
- **Authentication**: Laravel Sanctum for SPA authentication
- **Role-Based Access**: Super Admin, Store Owner, Store Manager, Customer roles
- **File Uploads**: Product images and store assets
- **Queue System**: Background job processing
- **Audit Logging**: Comprehensive activity tracking
- **CORS Support**: Configured for React frontend

## Requirements

- PHP 8.2+
- MySQL 8.0+ or PostgreSQL 13+
- Composer
- Node.js (for frontend development)

## Quick Start

### 1. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2. Database Setup

```bash
# Configure your database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tedara
DB_USERNAME=root
DB_PASSWORD=

# Run migrations and seeders
php artisan migrate --seed
```

### 3. Start Development Server

```bash
# Start Laravel development server
php artisan serve

# In another terminal, start queue worker
php artisan queue:work

# Optional: Start log viewer
php artisan pail
```

### 4. Frontend Integration

The API is configured to work with the React frontend running on `http://localhost:5173`.

## Development Tools

### Code Formatting

```bash
# Format code with Laravel Pint
composer format

# Check formatting without making changes
composer format:check
```

### Static Analysis

```bash
# Run PHPStan analysis
composer analyse

# Clear PHPStan cache
composer analyse:clear
```

### Testing

```bash
# Run tests
composer test

# Run tests with coverage
php artisan test --coverage
```

### Linting

```bash
# Run all linting checks
composer lint
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout (authenticated)
- `POST /api/auth/refresh` - Refresh token (authenticated)
- `GET /api/auth/me` - Get current user (authenticated)

### Store Management

- `GET /api/stores` - List stores (admin only)
- `POST /api/stores` - Create store (admin only)
- `GET /api/stores/{id}` - Get store details
- `PUT /api/stores/{id}` - Update store
- `DELETE /api/stores/{id}` - Delete store (admin only)

### Product Management

- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product details
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/images` - Upload product images

### Order Management

- `GET /api/orders` - List orders (with filters)
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order status
- `DELETE /api/orders/{id}` - Cancel order

### Customer Management

- `GET /api/customers` - List customers (with filters)
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer details
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Reports & Analytics

- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/products` - Product performance
- `GET /api/reports/customers` - Customer analytics
- `GET /api/analytics/dashboard` - Dashboard metrics

## Environment Configuration

### Database

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tedara
DB_USERNAME=root
DB_PASSWORD=
```

### Queue

```env
QUEUE_CONNECTION=database
```

### Mail (Development)

```env
MAIL_MAILER=log
```

### Sanctum (SPA Authentication)

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:3000,127.0.0.1:5173
SESSION_DOMAIN=localhost
```

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── Admin/
│   │   └── Api/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Providers/
└── Services/

config/
├── auth.php
├── cors.php
├── sanctum.php
└── ...

database/
├── migrations/
├── seeders/
└── factories/

routes/
└── api.php
```

## Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set up Redis for caching and sessions
- [ ] Configure file storage (S3 recommended)
- [ ] Set up queue workers
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging

### Queue Workers

```bash
# Start queue workers
php artisan queue:work --daemon

# Monitor failed jobs
php artisan queue:failed
php artisan queue:retry all
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
