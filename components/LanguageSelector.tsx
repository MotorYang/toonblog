import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 bg-white border-2 border-black rounded-lg shadow-toon hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center w-10 h-10 font-black text-sm text-gray-900"
      title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      {language === 'en' ? 'EN' : '中'}
    </button>
  );
};