import { ScrollText, Smile, Zap } from 'lucide-react';
import React from 'react';

import { useTheme } from '@/context/ThemeContext';

import { Theme } from '../../types.ts';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const order: Theme[] = ['cartoon', 'cyberpunk', 'chinese'];
    const nextIndex = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIndex]);
  };

  const icons = {
    cartoon: <Smile size={20} />,
    cyberpunk: <Zap size={20} />,
    chinese: <ScrollText size={20} />,
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 bg-white border-2 border-black rounded-lg shadow-toon hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center w-10 h-10 text-gray-900"
      title="Switch Theme"
    >
      {icons[theme]}
    </button>
  );
};
