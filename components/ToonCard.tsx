import React from 'react';

interface ToonCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'yellow' | 'blue' | 'purple' | 'red';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const ToonCard: React.FC<ToonCardProps> = ({
  children,
  className = '',
  color = 'white',
  hoverEffect = false,
  onClick,
}) => {
  const bgColors = {
    white: 'bg-white text-gray-900', // Default theme text on white/dark card
    yellow: 'bg-toon-yellow text-toon-ink', // Force ink color on colored backgrounds
    blue: 'bg-toon-blue text-toon-ink',
    purple: 'bg-toon-purple text-white', // Purple is usually dark enough for white text
    red: 'bg-toon-red text-white',
  };

  const baseClasses = `
    border-4 border-black rounded-xl p-4 md:p-6 shadow-toon
    transition-all duration-200
    ${bgColors[color]}
    ${className}
  `;

  const hoverClasses = hoverEffect
    ? 'hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none cursor-pointer'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses}`} onClick={onClick}>
      {children}
    </div>
  );
};
