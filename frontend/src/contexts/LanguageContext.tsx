import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar';
    return savedLanguage || 'en';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  useEffect(() => {
    // Update HTML dir attribute
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', language);
    
    // Load RTL CSS if needed
    if (isRTL) {
      import('../styles/rtl.css');
    }
  }, [language, isRTL]);

  const value: LanguageContextType = {
    language,
    isRTL,
    toggleLanguage,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
