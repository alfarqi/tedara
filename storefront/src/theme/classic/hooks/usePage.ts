import { useState, useEffect } from 'react';
import { getStorefrontApiUrl } from '../../../config/api';

interface Section {
  id: string;
  type: string;
  sort: number;
  props: Record<string, any>;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  template: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  is_home: boolean;
  sections: Section[];
  created_at: string;
  updated_at: string;
}

interface PageResponse {
  data: Page;
  meta: {
    tenant: {
      handle: string;
      display_name: string;
    };
  };
}

export function usePage(tenant: string, slug: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${getStorefrontApiUrl(tenant)}/page/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Page not found');
          }
          throw new Error(`Failed to fetch page: ${response.statusText}`);
        }

        const data: PageResponse = await response.json();
        setPage(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch page');
        console.error('Page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tenant && slug) {
      fetchPage();
    }
  }, [tenant, slug]);

  return { page, loading, error };
}
