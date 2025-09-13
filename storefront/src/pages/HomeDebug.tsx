import React, { useState, useEffect } from 'react';

interface HomeDebugProps {
  tenant: string;
}

export const HomeDebug: React.FC<HomeDebugProps> = ({ tenant }) => {
  const [themeData, setThemeData] = useState<any>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching data for tenant:', tenant);

        // Test theme API
        const themeResponse = await fetch(`http://localhost:8000/api/storefront/${tenant}/theme`);
        console.log('Theme response status:', themeResponse.status);
        
        if (!themeResponse.ok) {
          throw new Error(`Theme API failed: ${themeResponse.status} ${themeResponse.statusText}`);
        }
        
        const themeResult = await themeResponse.json();
        console.log('Theme data:', themeResult);
        setThemeData(themeResult);

        // Test page API
        const pageResponse = await fetch(`http://localhost:8000/api/storefront/${tenant}/page/home`);
        console.log('Page response status:', pageResponse.status);
        
        if (!pageResponse.ok) {
          throw new Error(`Page API failed: ${pageResponse.status} ${pageResponse.statusText}`);
        }
        
        const pageResult = await pageResponse.json();
        console.log('Page data:', pageResult);
        setPageData(pageResult);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading data for tenant: {tenant}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 mb-4">Tenant: {tenant}</p>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Check browser console for detailed error information.</p>
            <p>Make sure both servers are running:</p>
            <ul className="text-left mt-2">
              <li>• Laravel: http://localhost:8000</li>
              <li>• Storefront: http://localhost:5175</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Mode - Feras Store</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Theme Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(themeData, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Page Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(pageData, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Success!</h2>
          <p className="text-green-700">
            Both API endpoints are working correctly. The storefront should now display properly.
          </p>
        </div>
      </div>
    </div>
  );
};

