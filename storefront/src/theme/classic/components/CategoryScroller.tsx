import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { useTenant } from '../../../hooks/useTenant';
import type { Category } from '../types';

interface CategoryScrollerProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categorySlug: string) => void;
}

export function CategoryScroller({ categories, selectedCategory, onCategorySelect }: CategoryScrollerProps) {
  const tenant = useTenant();
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg hidden lg:block">Categories</h3>
      
      {/* Mobile horizontal scroll */}
      <div className="lg:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop vertical list */}
      <div className="hidden lg:block space-y-2">
        {/* Individual Categories */}
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/${tenant}/category/${category.slug}`}
            onClick={() => onCategorySelect(category.slug)}
            className={`block w-full text-left p-3 rounded-lg transition-colors ${
              selectedCategory === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              {category.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
