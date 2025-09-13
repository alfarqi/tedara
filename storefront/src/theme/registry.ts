import { Layout as ClassicLayout } from './classic/Layout';
import { Hero as ClassicHero } from './classic/sections/Hero';
import { ProductGrid as ClassicProductGrid } from './classic/sections/ProductGrid';
import { RichText as ClassicRichText } from './classic/sections/RichText';

export interface ThemeComponents {
  Layout: React.ComponentType<any>;
  sections: {
    [key: string]: React.ComponentType<any>;
  };
}

export const themeRegistry: Record<string, ThemeComponents> = {
  classic: {
    Layout: ClassicLayout,
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      featured_products: ClassicProductGrid,
      content: ClassicRichText,
      rich_text: ClassicRichText,
    },
  },
  modern: {
    Layout: ClassicLayout, // Fallback to classic for now
    sections: {
      hero: ClassicHero,
      product_grid: ClassicProductGrid,
      featured_products: ClassicProductGrid,
      content: ClassicRichText,
      rich_text: ClassicRichText,
    },
  },
};

export function getTheme(themeKey: string): ThemeComponents {
  return themeRegistry[themeKey] || themeRegistry.classic;
}

