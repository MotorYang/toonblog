import { Music } from 'lucide-react';
import React from 'react';

import { ToonCard } from '../components/ToonCard';
import { useLanguage } from '../context/LanguageContext';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

export const Settings: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black flex items-center justify-center gap-3">
          {t('settings.title')}
        </h1>
      </div>

      <ToonCard color="white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Music */}
          <div className="space-y-4 divide-y-4 divide-yellow-600 divide-dashed">
            <label className="block text-lg flex items-center text-gray-700">
              <Music size={18} />
              {t('settings.music')}
            </label>
          </div>
          {/* Gemini API */}
          <div className="space-y-4 divide-y-4 divide-yellow-600 divide-dashed">
            <label className="block text-lg flex items-center text-gray-700">
              <Music size={18} />
              {t('settings.music')}
            </label>
          </div>
        </form>
      </ToonCard>
    </div>
  );
};
