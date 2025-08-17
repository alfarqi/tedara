import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-link text-decoration-none p-0 me-3"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
             <i data-lucide="globe" className="fs-18"></i>
      <span className="ms-1 fw-medium">
        {language === 'en' ? 'EN' : 'عربي'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
