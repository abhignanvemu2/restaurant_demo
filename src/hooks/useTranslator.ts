import { useState } from 'react';
import { translator, Language } from '../utils/translator';

export const useTranslator = () => {
  const [language, setLanguage] = useState<Language>(translator.getLanguage());

  const changeLanguage = (newLanguage: Language) => {
    translator.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key: string) => translator.translate(key);

  return {
    language,
    changeLanguage,
    t
  };
};