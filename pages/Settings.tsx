import { Settings as SettingsIcon } from 'lucide-react';
import React from 'react';

import { useLanguage } from '../context/LanguageContext';

export const Settings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 md:space-y-8 pd-12">
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black flex items-center justify-center gap-3">
          <SettingsIcon size={32} className="text-toon-red md:w-10 md:h-10" />
          {t('dash.title')}
        </h1>
        <p className="font-bold text-gray-600">{t('dash.subtitle')}</p>
      </div>
    </div>
  );
};
