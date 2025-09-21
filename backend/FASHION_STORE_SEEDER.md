# Fashion Store Seeder

This seeder creates a complete fashion store with categories and products using high-quality images from Pexels.

## What it creates:

### Store & Tenant
- **Store Name**: Fashion Store
- **Domain**: fashion-store
- **Tenant Handle**: fashion-store
- **Owner**: fashion@tedara.com
- **Category**: Fashion
- **Currency**: SAR
- **Language**: English

### Categories (5 categories)
1. **Women's Clothing** - Elegant and trendy women's fashion
2. **Men's Clothing** - Stylish and comfortable men's fashion
3. **Accessories** - Fashion accessories, jewelry, and style essentials
4. **Shoes & Footwear** - Comfortable and stylish footwear
5. **Bags & Handbags** - Trendy bags and handbags

### Products (15 products)
- **Women's Clothing**: 3 products (dress, blazer, jeans)
- **Men's Clothing**: 3 products (t-shirt, suit, hoodie)
- **Accessories**: 3 products (necklace, watch, sunglasses)
- **Shoes & Footwear**: 3 products (running shoes, dress shoes, sneakers)
- **Bags & Handbags**: 3 products (handbag, backpack, clutch)

## How to run:

### Option 1: Run the specific command
```bash
php artisan seed:fashion-store
```

### Option 2: Run as part of full database seeding
```bash
php artisan db:seed --class=FashionStoreSeeder
```

### Option 3: Include in full database reset
```bash
php artisan migrate:fresh --seed
```

## Features:
- ✅ Uses high-quality Pexels images
- ✅ Handles existing data gracefully (won't create duplicates)
- ✅ Includes proper pricing with original prices for discounts
- ✅ Realistic product descriptions and specifications
- ✅ Proper categorization and tagging
- ✅ Multi-tenant support
- ✅ Complete store setup with settings

## Store Access:
After seeding, you can access the store at:
- **Storefront**: `https://yourdomain.com/fashion-store`
- **Admin**: Login with `fashion@tedara.com` / `password`

## Images Used:
All product and category images are sourced from Pexels and include:
- Fashion photography
- Product shots
- Lifestyle images
- High-resolution quality (800px width)

The seeder is designed to be idempotent - you can run it multiple times without creating duplicates.
