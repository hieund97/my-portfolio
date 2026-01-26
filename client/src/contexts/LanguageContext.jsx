import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createTranslator, defaultLanguage, languages } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && languages[saved] ? saved : defaultLanguage;
  });

  const [t, setT] = useState(() => createTranslator(language));

  useEffect(() => {
    localStorage.setItem('language', language);
    setT(() => createTranslator(language));
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'vi' ? 'en' : 'vi');
  }, []);

  const switchLanguage = useCallback((lang) => {
    if (languages[lang]) {
      setLanguage(lang);
    }
  }, []);

  const currentLanguage = languages[language];

  return (
    <LanguageContext.Provider value={{ 
      language, 
      t, 
      toggleLanguage, 
      switchLanguage,
      currentLanguage,
      languages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
