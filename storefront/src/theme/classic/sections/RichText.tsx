import React from 'react';

interface RichTextProps {
  title?: string;
  content?: string;
  image?: string;
  image_position?: 'left' | 'right' | 'top' | 'bottom';
  background_color?: string;
  text_align?: 'left' | 'center' | 'right';
  max_width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const RichText: React.FC<RichTextProps> = ({
  title,
  content = 'This is sample content for the rich text section. You can customize this content through the admin panel.',
  image,
  image_position = 'top',
  background_color,
  text_align = 'left',
  max_width = 'lg'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const renderContent = () => (
    <div className={`${textAlignClasses[text_align]} ${maxWidthClasses[max_width]} mx-auto`}>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );

  const renderImage = () => {
    if (!image) return null;

    return (
      <div className="mb-8">
        <img
          src={image}
          alt={title || 'Content image'}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    );
  };

  const renderWithImage = () => {
    if (!image) {
      return renderContent();
    }

    switch (image_position) {
      case 'left':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              {renderContent()}
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={image}
                alt={title || 'Content image'}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        );
      
      case 'right':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={image}
                alt={title || 'Content image'}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div>
              {renderContent()}
            </div>
          </div>
        );
      
      case 'bottom':
        return (
          <div>
            {renderContent()}
            {renderImage()}
          </div>
        );
      
      case 'top':
      default:
        return (
          <div>
            {renderImage()}
            {renderContent()}
          </div>
        );
    }
  };

  return (
    <section 
      className="py-16"
      style={{ backgroundColor: background_color }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderWithImage()}
      </div>
    </section>
  );
};










