# Storefront React App

A multi-tenant storefront application built with React, TypeScript, and Vite. This app automatically derives the tenant from the URL path and fetches content from the Laravel API.

## Features

- **Multi-tenant Architecture**: Automatically detects tenant from URL path
- **Theme System**: Extensible theme system with classic theme included
- **Dynamic Routing**: React Router with tenant-aware routing
- **API Integration**: Fetches data from Laravel storefront API
- **Responsive Design**: Built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
src/
├── theme/
│   ├── registry.ts          # Theme registry and component mapping
│   └── classic/
│       ├── Layout.tsx       # Main layout component
│       └── sections/
│           ├── Hero.tsx     # Hero section component
│           ├── ProductGrid.tsx # Product grid section
│           └── RichText.tsx # Rich text content section
├── hooks/
│   ├── useTheme.ts          # Hook for fetching theme data
│   └── usePage.ts           # Hook for fetching page data
├── pages/
│   ├── Home.tsx             # Home page component
│   ├── Catalog.tsx          # Product catalog page
│   ├── Product.tsx          # Individual product page
│   └── Dynamic.tsx          # Dynamic page component
├── App.tsx                  # Main app with routing
├── main.tsx                 # Entry point with tenant detection
└── index.css                # Global styles with Tailwind
```

## URL Structure

The app automatically detects the tenant from the first path segment:

- `https://example.com/salmeen-electronics/` → Tenant: `salmeen-electronics`
- `https://example.com/fatooma-store/catalog` → Tenant: `fatooma-store`
- `https://example.com/demo-store/product/sample-product` → Tenant: `demo-store`

## Routes

- `/` - Home page (fetches page with slug 'home')
- `/catalog` - Product catalog page
- `/product/:slug` - Individual product page
- `/:slug` - Dynamic page (about, contact, etc.)

## API Integration

The app fetches data from these Laravel API endpoints:

- `GET /api/storefront/{tenant}/theme` - Theme settings and configuration
- `GET /api/storefront/{tenant}/page/{slug}` - Page content with sections
- `GET /api/storefront/{tenant}/products` - Product list
- `GET /api/storefront/{tenant}/products/{slug}` - Individual product

## Theme System

### Theme Registry

Themes are registered in `src/theme/registry.ts`:

```typescript
export const themeRegistry: Record<string, ThemeComponents> = {
  classic: {
    Layout: ClassicLayout,
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      content: ClassicRichText,
    },
  },
};
```

### Adding New Themes

1. Create a new theme folder: `src/theme/modern/`
2. Implement Layout and section components
3. Register in `theme/registry.ts`
4. The theme will be automatically available

### Section Types

- `hero` - Hero banner with title, subtitle, CTA
- `product_grid` - Product listing with filters and pagination
- `featured_products` - Featured products showcase
- `content` - Rich text content with optional image
- `rich_text` - Alias for content section

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Configuration

### API Base URL

The app assumes the Laravel API is available at the same domain. To change this, update the fetch URLs in the hooks:

```typescript
// In useTheme.ts and usePage.ts
const response = await fetch(`/api/storefront/${tenant}/theme`);
```

### Default Tenant

If no tenant is detected in the URL, the app defaults to `demo-store`. This can be changed in `main.tsx`:

```typescript
function getTenantFromPath(): string {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments[0] || 'your-default-tenant';
}
```

## Styling

The app uses Tailwind CSS with custom CSS variables for theme colors:

```css
:root {
  --primary-color: #6f42c1;
  --secondary-color: #6c757d;
}
```

Theme colors are automatically applied from the API response.

## Error Handling

- Loading states with spinners
- Error boundaries for failed API calls
- Fallback content for missing data
- 404 pages for non-existent routes

## Browser Support

- Modern browsers with ES2020 support
- Responsive design for mobile and desktop
- Progressive enhancement

## Deployment

The app can be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the `dist` folder
3. Configure your web server to handle client-side routing
4. Ensure the Laravel API is accessible

### Nginx Configuration

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache Configuration

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.