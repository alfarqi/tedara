# Skeleton Components

A collection of reusable skeleton preloader components for displaying loading states in tables and pages.

## Components

### 1. PageSkeleton
General-purpose skeleton component with multiple types.

### 2. CustomerSkeleton
Specialized skeleton for customer table rows that matches the exact design.

### 3. TableSkeleton
Flexible table skeleton component that can be customized for different table structures.

## CustomerSkeleton

Matches the exact customer page design with the following columns:

- **CUSTOMER ID**: Checkbox + ID number
- **CUSTOMER**: Avatar + Name + Email
- **JOIN DATE**: Date
- **TOTAL ORDERS**: Number
- **TOTAL SPENT**: Amount
- **STATUS**: Badge
- **CONTACT**: Phone + Email

### Usage

```tsx
import CustomerSkeleton from '../components/common/CustomerSkeleton';

// In your table
<table>
  <thead>
    {/* Your table headers */}
  </thead>
  {loading ? (
    <CustomerSkeleton count={8} />
  ) : (
    <tbody>
      {/* Your actual table rows */}
    </tbody>
  )}
</table>
```

## TableSkeleton

A flexible table skeleton that can be customized for different table structures.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `8` | Number of skeleton rows |
| `columns` | `number` | `7` | Number of columns |
| `showAvatar` | `boolean` | `false` | Show avatar in first column |
| `showCheckbox` | `boolean` | `false` | Show checkbox in first column |
| `showBadge` | `boolean` | `false` | Show badge in status column |

### Usage Examples

```tsx
import TableSkeleton from '../components/common/TableSkeleton';

// Basic table skeleton
<TableSkeleton count={5} columns={4} />

// Customer-like table with avatar and checkbox
<TableSkeleton 
  count={8} 
  columns={7} 
  showAvatar={true} 
  showCheckbox={true} 
  showBadge={true} 
/>

// Product table skeleton
<TableSkeleton count={6} columns={5} showAvatar={true} />
```

## Column Structure

The TableSkeleton component has predefined column structures:

- **Column 0**: Checkbox + ID (if showCheckbox) or simple text
- **Column 1**: Avatar + Name + Email (if showAvatar) or simple text
- **Column 2**: Date/Text field
- **Column 3**: Number field
- **Column 4**: Number field
- **Column 5**: Badge (if showBadge) or text field
- **Column 6**: Multi-line contact info
- **Column 7+**: Default text fields

## Styling

All skeleton components include:

- **Shimmer Animation**: Smooth loading effect
- **Dark Mode Support**: Automatic theme adaptation
- **Responsive Design**: Works on all screen sizes
- **Consistent Styling**: Matches the application design system

## Customization

You can customize the skeleton appearance by:

1. **Modifying the CSS**: Update the gradient colors and animation timing
2. **Adjusting Dimensions**: Change width and height of skeleton elements
3. **Adding Custom Classes**: Use the `className` prop for additional styling

## Best Practices

1. **Match Real Content**: Ensure skeleton dimensions match actual content
2. **Consistent Count**: Use the same number of skeleton items as expected data
3. **Appropriate Timing**: Show skeleton for at least 200ms to avoid flickering
4. **Accessibility**: Skeleton provides better UX than generic spinners
5. **Performance**: Use CSS animations instead of JavaScript for better performance














