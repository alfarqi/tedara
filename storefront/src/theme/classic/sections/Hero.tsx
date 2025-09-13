import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  background_image?: string;
  cta_text?: string;
  cta_link?: string;
  show_search?: boolean;
  height?: 'small' | 'medium' | 'large';
}

export const Hero: React.FC<HeroProps> = ({
  title = 'Welcome to Our Store',
  subtitle = 'Discover amazing products and great deals',
  background_image,
  cta_text = 'Shop Now',
  cta_link = '/catalog',
  show_search = false,
  height = 'large'
}) => {
  const heightClasses = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-screen'
  };

  return (
    <section 
      className={`relative ${heightClasses[height]} flex items-center justify-center`}
      style={{
        backgroundImage: background_image ? `url(${background_image})` : undefined,
        backgroundColor: background_image ? undefined : 'var(--primary-color)',
      }}
    >
      {/* Background Overlay */}
      {background_image && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl sm:text-2xl text-white mb-8 opacity-90">
            {subtitle}
          </p>
        )}
        
        {/* Search Bar */}
        {show_search && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        {/* CTA Button */}
        {cta_text && cta_link && (
          <a
            href={cta_link}
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            {cta_text}
          </a>
        )}
      </div>
      
      {/* Scroll Indicator */}
      {height === 'large' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
};
