import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { usePage } from '../hooks/usePage';
import { getTheme } from '../theme/registry';

interface HomeProps {
  tenant: string;
}

export const Home: React.FC<HomeProps> = ({ tenant }) => {
  const { theme: themeData, loading: themeLoading } = useTheme(tenant);
  const { page, loading: pageLoading } = usePage(tenant, 'home');

  if (themeLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!themeData || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(themeData.theme.key);
  const { Layout } = theme;

  // Render sections
  const renderSection = (section: any) => {
    const SectionComponent = theme.sections[section.type];
    if (!SectionComponent) {
      console.warn(`Section type "${section.type}" not found in theme`);
      return null;
    }
    return <SectionComponent key={section.id} {...section.props} />;
  };

  return (
    <Layout theme={themeData}>
      {page.sections.map(renderSection)}
    </Layout>
  );
};
