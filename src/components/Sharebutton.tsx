import { Check, Copy, Share2, X } from 'lucide-react';
import React, { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = window.location.origin + url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-black hover:text-white',
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      name: 'Reddit',
      icon: '🔴',
      url: `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
      color: 'hover:bg-orange-600 hover:text-white',
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-500 hover:text-white',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
      color: 'hover:bg-green-600 hover:text-white',
    },
  ];

  // 使用原生分享 API（如果支持）
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: fullUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-lg bg-white hover:bg-toon-blue hover:text-white font-bold text-xs shadow-toon-sm hover:shadow-toon transition-all ${className}`}
        title="分享文章"
      >
        <Share2 size={14} />
        <span className="hidden sm:inline">分享</span>
      </button>

      {/* 分享面板 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white border-4 border-black rounded-2xl shadow-toon-xl max-w-md w-full mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Share2 size={24} />
                  分享到
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 复制链接 */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fullUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border-3 border-black rounded-lg font-mono text-xs bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 border-3 border-black rounded-lg font-black text-sm transition-all shadow-toon hover:shadow-toon-lg ${
                      copied ? 'bg-green-500 text-white' : 'bg-toon-yellow hover:bg-yellow-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="inline mr-1" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="inline mr-1" />
                        复制
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 分享选项 */}
              <div className="grid grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 p-4 border-3 border-black rounded-xl bg-white transition-all shadow-toon hover:shadow-toon-lg ${option.color} group`}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {option.icon}
                    </span>
                    <span className="text-xs font-black">{option.name}</span>
                  </a>
                ))}
              </div>

              {/* 提示 */}
              <div className="mt-4 p-3 bg-gradient-to-r from-toon-blue/10 to-toon-purple/10 border-2 border-black rounded-lg">
                <p className="text-xs font-bold text-gray-700 text-center">
                  ✨ 分享精彩内容给你的朋友们！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 简化版分享按钮（仅图标）
export const ShareButtonCompact: React.FC<ShareButtonProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 border-2 border-black rounded-lg bg-white hover:bg-toon-blue hover:text-white transition-all shadow-toon-sm hover:shadow-toon"
        title="分享"
      >
        <Share2 size={16} />
      </button>

      {isOpen && <ShareButton {...props} className="hidden" />}
    </>
  );
};
