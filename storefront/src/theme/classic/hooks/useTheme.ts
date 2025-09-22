import { useState, useEffect } from 'react';
import { getStorefrontApiUrl } from '../../../config/api';
import { logMobileDebug, logMobileError, isMobile } from '../../../utils/mobileDebug';

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

        const apiUrl = `${getStorefrontApiUrl(tenant)}/theme`;
        logMobileDebug('Fetching theme for tenant', { tenant, apiUrl, isMobile: isMobile() });

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        logMobileDebug('Theme API Response Status', { status: response.status, tenant });
        
        if (!response.ok) {
          const errorText = await response.text();
          logMobileError(new Error(`API Error: ${response.status} ${response.statusText}`), 'Theme API');
          throw new Error(`Failed to fetch theme: ${response.status} ${response.statusText}`);
        }

        const data: ThemeResponse = await response.json();
        logMobileDebug('Theme data received successfully', { tenant, hasStore: !!data.meta.store });
        
        setTheme(data.data);
        setStore(data.meta.store);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch theme';
        setError(errorMessage);
        logMobileError(err instanceof Error ? err : new Error(errorMessage), 'Theme fetch');
      } finally {
        setLoading(false);
      }
    };

    if (tenant) {
      fetchTheme();
    } else {
      logMobileDebug('No tenant provided to useTheme hook');
      setError('No tenant specified');
      setLoading(false);
    }
  }, [tenant]);

  return { theme, store, loading, error };
}
