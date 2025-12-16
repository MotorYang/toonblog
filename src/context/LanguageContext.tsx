// src/context/LanguageContext
import React, { createContext, useContext, useState } from 'react';

import { translations } from '@/locales/translations';

import { Language, LanguageContextType } from '../../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 全局语言状态（用于 Store）
let globalLanguage: Language = (() => {
  const saved = localStorage.getItem('app-language');
  return saved === 'zh' || saved === 'en' ? saved : 'zh';
})();

// 导出独立的翻译函数（可以在 Store 中使用）
export const translate = (key: string, params?: Record<string, string | number>): string => {
  const langDict = translations[globalLanguage] as Record<string, string>;
  let text = langDict[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return text;
};

// 更新全局语言（供 Provider 调用）
export const updateGlobalLanguage = (lang: Language) => {
  globalLanguage = lang;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return saved === 'zh' || saved === 'en' ? saved : 'zh';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    updateGlobalLanguage(lang); // 同步更新全局语言
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] as Record<string, string>;
    let text = langDict[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
