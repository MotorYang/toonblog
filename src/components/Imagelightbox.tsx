import { X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setScale(1);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));

  return (
    <>
      {/* 缩略图 */}
      <div className={`relative cursor-zoom-in group ${className}`} onClick={() => setIsOpen(true)}>
        <img src={src} alt={alt} className="w-full h-auto" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white border-3 border-black rounded-full p-3 shadow-toon-lg">
            <ZoomIn size={24} className="text-gray-900" />
          </div>
        </div>
      </div>

      {/* 灯箱 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          {/* 控制栏 */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-3 bg-white border-3 border-black rounded-xl shadow-toon-lg hover:shadow-toon hover:bg-gray-100 transition-all"
              disabled={scale <= 0.5}
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-3 bg-white border-3 border-black rounded-xl shadow-toon-lg hover:shadow-toon hover:bg-gray-100 transition-all"
              disabled={scale >= 3}
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 bg-toon-red text-white border-3 border-black rounded-xl shadow-toon-lg hover:shadow-toon hover:bg-red-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* 缩放信息 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-3 border-black rounded-full px-4 py-2 shadow-toon-lg">
            <span className="font-black text-sm">{Math.round(scale * 100)}%</span>
          </div>

          {/* 图片容器 */}
          <div
            className="w-full h-full flex items-center justify-center p-8 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain transition-transform duration-200 border-4 border-white rounded-lg shadow-2xl"
              style={{ transform: `scale(${scale})` }}
            />
          </div>
        </div>
      )}
    </>
  );
};
