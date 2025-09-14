# PageSkeleton Component

A reusable skeleton preloader component for displaying loading states in pages.

## Usage

```tsx
import PageSkeleton from '../components/common/PageSkeleton';

// Basic list skeleton
<PageSkeleton type="list" count={5} />

// Table skeleton
<PageSkeleton type="table" count={8} />

// Grid skeleton
<PageSkeleton type="grid" count={6} />

// Form skeleton
<PageSkeleton type="form" count={3} />

// Card skeleton
<PageSkeleton type="card" count={2} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'list' \| 'table' \| 'grid' \| 'form' \| 'card'` | `'list'` | The type of skeleton to display |
| `count` | `number` | `5` | Number of skeleton items to display |
| `className` | `string` | `''` | Additional CSS classes |

## Types

### List Skeleton
Displays a list of items with title, subtitle, and action buttons.

### Table Skeleton
Displays table rows with multiple columns. Use within `<tbody>` tags.

### Grid Skeleton
Displays a grid of cards with image, title, description, and buttons.

### Form Skeleton
Displays form fields with labels and input fields.

### Card Skeleton
Displays a card with header, content, and multiple list items.

## Examples

### In a loading state
```tsx
{loading ? (
  <PageSkeleton type="list" count={5} />
) : (
  <div>
    {/* Your actual content */}
  </div>
)}
```

### Table with skeleton
```tsx
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  </thead>
  {loading ? (
    <PageSkeleton type="table" count={5} />
  ) : (
    <tbody>
      {/* Your table rows */}
    </tbody>
  )}
</table>
```

## Styling

The component includes built-in CSS animations and supports dark mode. The skeleton lines use a shimmer effect that automatically adapts to light and dark themes.

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS custom properties (CSS variables) support





