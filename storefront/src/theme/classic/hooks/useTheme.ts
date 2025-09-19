import { useState, useEffect } from 'react';

interface ThemeSettings {
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  header_style?: string;
  footer_style?: string;
  logo_url?: string;
  favicon_url?: string;
  store_name?: string;
  store_slogan?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

interface Theme {
  theme: {
    key: string;
    name: string;
    version: string;
  };
  settings: ThemeSettings;
}

interface ThemeResponse {
  data: Theme;
  meta: {
    tenant: {
      handle: string;
      display_name: string;
    };
    store?: {
      id: number;
      name: string;
      logo?: string;
      description?: string;
    } | null;
  };
}

export function useTheme(tenant: string) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [store, setStore] = useState<ThemeResponse['meta']['store']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/storefront/${tenant}/theme`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch theme: ${response.statusText}`);
        }

        const data: ThemeResponse = await response.json();
        setTheme(data.data);
        setStore(data.meta.store);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch theme');
        console.error('Theme fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchTheme();
    }
  }, [tenant]);

  return { theme, store, loading, error };
}
