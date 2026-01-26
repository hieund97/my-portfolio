import en from './locales/en.json';
import vi from './locales/vi.json';

export const languages = {
  vi: { name: 'Tiếng Việt', flag: '🇻🇳', translations: vi },
  en: { name: 'English', flag: '🇬🇧', translations: en },
};

export const defaultLanguage = 'vi';

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'nav.home') returns obj.nav.home
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

/**
 * Create translation function for a specific language
 */
export const createTranslator = (lang) => {
  const translations = languages[lang]?.translations || languages[defaultLanguage].translations;
  
  return (key, fallback = key) => {
    const value = getNestedValue(translations, key);
    return value !== undefined ? value : fallback;
  };
};
