import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ar', name: 'عربي', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="position-relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-between w-100"
        style={{
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#6c757d',
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease',
          minWidth: '75px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#6f42c1';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#6c757d';
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span>{currentLanguage.flag}</span>
          <span className="fw-medium">{currentLanguage.name}</span>
        </div>
        <i className={isOpen ? 'ti ti-chevron-up' : 'ti ti-chevron-down'} style={{ 
          transition: 'all 0.2s ease'
        }}></i>
      </button>

      {isOpen && (
        <div 
          className="position-absolute w-100"
          style={{
            bottom: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            marginBottom: '2px'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="btn btn-link w-100 d-flex align-items-center gap-2 text-start"
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: language === lang.code ? '#6f42c1' : '#6c757d',
                backgroundColor: language === lang.code ? 'rgba(111, 66, 193, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '0',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{lang.flag}</span>
              <span className="fw-medium">{lang.name}</span>
              {language === lang.code && (
                <i className="ti ti-check ms-auto" style={{ color: '#6f42c1' }}></i>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
