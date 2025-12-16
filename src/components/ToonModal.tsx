import { AlertTriangle, Info, X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ToonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export const ToonModal: React.FC<ToonModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'default',
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const headerColors = {
    default: 'bg-toon-yellow',
    danger: 'bg-toon-red text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b-4 border-black ${headerColors[variant]}`}
        >
          <div className="flex items-center gap-3">
            {variant === 'danger' ? <AlertTriangle size={24} /> : <Info size={24} />}
            <h3 className="text-xl font-black uppercase tracking-wide">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-lg font-bold text-gray-700">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="bg-gray-50 px-6 py-4 border-t-4 border-black flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
