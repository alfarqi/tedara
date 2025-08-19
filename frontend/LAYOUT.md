# Layout System Documentation

This document describes the layout system built for the Tedara admin dashboard, inspired by the Inspinia theme.

## Components

### Layout
The main layout component that wraps the entire application and provides the overall structure.

**Location:** `src/components/layout/Layout.tsx`

**Props:**
- `children`: React nodes to render in the main content area

**Usage:**
```tsx
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <YourPageContent />
    </Layout>
  );
}
```

### Header
The top navigation bar containing the logo, search, notifications, and user menu.

**Location:** `src/components/layout/Header.tsx`

**Features:**
- Responsive design
- Search functionality
- Language selector
- Message notifications
- System notifications
- User dropdown menu
- Dark/light mode toggle
- Settings button

### Sidebar
The left navigation sidebar with collapsible menu items.

**Location:** `src/components/layout/Sidebar.tsx`

**Features:**
- Collapsible navigation
- Multi-level menu support
- User profile section
- Responsive design
- Smooth animations

### Footer
The bottom footer with copyright information.

**Location:** `src/components/layout/Footer.tsx`

## Styling

The layout uses CSS custom properties (variables) for consistent theming:

```css
:root {
  --primary-color: #3b7ddd;
  --secondary-color: #6c757d;
  --success-color: #1cbb8c;
  --danger-color: #f06548;
  --warning-color: #f7b84b;
  --info-color: #17a2b8;
  --sidebar-width: 260px;
  --topbar-height: 70px;
  --border-color: #e9ecef;
  --text-muted: #6c757d;
  --bg-light: #f8f9fa;
}
```

## Responsive Design

The layout is fully responsive with breakpoints:
- **Desktop**: Full sidebar and header
- **Tablet**: Collapsible sidebar
- **Mobile**: Off-canvas sidebar

## Features

### Dark Mode Support
The layout includes CSS variables for dark mode theming. To implement dark mode:

1. Add `data-bs-theme="dark"` to the root element
2. The CSS variables will automatically switch to dark mode values

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus indicators

### Performance
- CSS-only animations
- Efficient re-renders
- Lazy loading support

## Usage Examples

### Basic Page
```tsx
import Layout from './components/layout/Layout';

function DashboardPage() {
  return (
    <Layout>
      <div className="page-title-head">
        <h4>Dashboard</h4>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome</h5>
              <p>Your content here...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### Custom Header Actions
```tsx
import Layout from './components/layout/Layout';

function CustomPage() {
  return (
    <Layout>
      <div className="page-title-head d-flex align-items-center">
        <div className="flex-grow-1">
          <h4>Custom Page</h4>
        </div>
        <div className="text-end">
          <button className="btn btn-primary">Add New</button>
        </div>
      </div>
      
      {/* Your content */}
    </Layout>
  );
}
```

## File Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.tsx      # Main layout wrapper
│       ├── Header.tsx      # Top navigation
│       ├── Sidebar.tsx     # Left navigation
│       ├── Footer.tsx      # Bottom footer
│       └── index.ts        # Exports
├── styles/
│   └── layout.css         # Layout styles
└── public/
    └── assets/
        └── images/
            ├── logo.svg    # Application logo
            ├── users/      # User avatars
            └── flags/      # Language flags
```

## Customization

### Colors
Update the CSS custom properties in `src/styles/layout.css`:

```css
:root {
  --primary-color: #your-primary-color;
  --secondary-color: #your-secondary-color;
  /* ... other colors */
}
```

### Sidebar Width
```css
:root {
  --sidebar-width: 280px; /* Default: 260px */
}
```

### Adding New Menu Items
Edit the `menuItems` array in `Sidebar.tsx`:

```tsx
const menuItems = [
  {
    id: 'your-menu',
    title: 'Your Menu',
    icon: <YourIcon />,
    href: '/your-route'
  },
  // ... existing items
];
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- React 19+
- TypeScript
- Lucide React (for icons)
- CSS Custom Properties




