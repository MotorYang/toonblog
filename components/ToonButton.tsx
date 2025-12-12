import { Loader2 } from 'lucide-react';
import React from 'react';

interface ToonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const ToonButton: React.FC<ToonButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-toon-yellow text-toon-ink hover:bg-yellow-400',
    secondary: 'bg-toon-blue text-toon-ink hover:bg-green-400',
    danger: 'bg-toon-red text-white hover:bg-red-500', // White text on Red is usually safe in all themes
    ghost: 'bg-white text-gray-900 hover:bg-gray-100', // Text matches theme text color on white
  };

  return (
    <button
      className={`
        relative inline-flex items-center justify-center
        border-4 border-black rounded-xl px-6 py-2 font-bold text-lg
        shadow-toon transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
};
