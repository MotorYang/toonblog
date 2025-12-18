import { Type } from 'lucide-react';
import React from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface FontSizeControlProps {
  fontSize: FontSize;
  onChange: (size: FontSize) => void;
}

export const FontSizeControl: React.FC<FontSizeControlProps> = ({ fontSize, onChange }) => {
  const sizes: Array<{ value: FontSize; label: string; size: string }> = [
    { value: 'small', label: '小', size: 'text-xs' },
    { value: 'medium', label: '中', size: 'text-sm' },
    { value: 'large', label: '大', size: 'text-base' },
    { value: 'xlarge', label: '特大', size: 'text-lg' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white border-3 border-black rounded-xl p-2 shadow-toon">
      <Type size={16} className="text-gray-600 flex-shrink-0" />
      <div className="flex gap-1">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => onChange(size.value)}
            className={`px-3 py-1.5 rounded-lg font-black border-2 border-black transition-all ${size.size} ${
              fontSize === size.value
                ? 'bg-toon-blue text-white shadow-toon scale-110'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-toon-sm'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// 获取对应的 prose 类名
export const getFontSizeClass = (fontSize: FontSize): string => {
  const mapping: Record<FontSize, string> = {
    small: 'prose-sm',
    medium: 'prose-base',
    large: 'prose-lg',
    xlarge: 'prose-xl',
  };
  return mapping[fontSize];
};
