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

        const responseText = await response.text();
        logMobileDebug('Raw API response received', { tenant, responseLength: responseText.length });
        
        let data: ThemeResponse;
        try {
          data = JSON.parse(responseText);
          logMobileDebug('JSON parsed successfully', { tenant, hasStore: !!data.meta?.store });
        } catch (parseError) {
          logMobileError(new Error(`JSON Parse Error: ${parseError}`), 'Theme API Response');
          throw new Error(`Invalid JSON response from API: ${parseError}`);
        }
        
        // Validate response structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response structure: not an object');
        }
        
        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Invalid response structure: missing data property');
        }
        
        if (!data.meta || typeof data.meta !== 'object') {
          throw new Error('Invalid response structure: missing meta property');
        }
        
        setTheme(data.data);
        setStore(data.meta.store || null);
      } catch (err) {
        let errorMessage = 'Failed to fetch theme';
        
        if (err instanceof Error) {
          errorMessage = err.message;
          
          // Handle specific error types
          if (err.name === 'TypeError') {
            errorMessage = `TypeError: ${err.message}. This usually means the API response format is unexpected.`;
          } else if (err.message.includes('JSON')) {
            errorMessage = `JSON Error: ${err.message}. The API response is not valid JSON.`;
          } else if (err.message.includes('fetch')) {
            errorMessage = `Network Error: ${err.message}. Check your internet connection.`;
          }
        }
        
        setError(errorMessage);
        logMobileError(err instanceof Error ? err : new Error(errorMessage), 'Theme fetch');
        
        // Log additional debugging info for TypeError
        if (err instanceof Error && err.name === 'TypeError') {
          logMobileError(new Error('TypeError detected - API response may be malformed'), 'TypeError Debug');
        }
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
