import { AlertTriangle, X } from 'lucide-react';
import React from 'react';

import { useLanguage } from '@/context/LanguageContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-toon-red',
    warning: 'bg-toon-yellow',
    info: 'bg-toon-blue',
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white border-3 sm:border-4 border-black rounded-xl sm:rounded-2xl shadow-toon-lg max-w-sm w-full animate-pop-in">
        {/* Header with Icon */}
        <div
          className={`${variantColors[variant]} border-b-3 sm:border-b-4 border-black rounded-t-lg sm:rounded-t-xl p-3 sm:p-4 flex items-center justify-between gap-2`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-white border-2 border-black rounded-lg p-1.5 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 truncate">
              {title ?? t('global.confirm.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-4 border-t-2 border-black flex gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 border-2 border-black rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 transition-all font-bold text-sm sm:text-base text-gray-900 shadow-toon-sm hover:shadow-toon touch-manipulation"
          >
            {cancelText ?? t('global.confirm.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 sm:px-4 py-2 border-2 border-black rounded-lg bg-toon-red text-white hover:bg-red-600 active:bg-red-700 transition-all font-bold text-sm sm:text-base shadow-toon-sm hover:shadow-toon touch-manipulation"
          >
            {confirmText ?? t('global.confirm.ok')}
          </button>
        </div>
      </div>
    </div>
  );
};
