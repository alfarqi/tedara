import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import type { Translations } from '../translations/translations';

export const useTranslations = (): Translations => {
  const { language } = useLanguage();
  return translations[language];
};
