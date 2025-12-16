import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- 类型定义 ---
type TipType = 'success' | 'error' | 'warning' | 'info';

interface TipConfig {
  title?: string;
  message: string;
  type?: TipType;
  duration?: number; // 毫秒，0表示不自动关闭
}

// --- 全局状态持有者 (闭包变量) ---
let tipRef: {
  add: (config: TipConfig) => void;
  remove: (id: string) => void;
} | null = null;

// 🔧 添加计数器确保 ID 唯一性
let idCounter = 0;

// 🔧 生成唯一 ID
const generateUniqueId = (): string => {
  return `${Date.now()}-${idCounter++}`;
};

// --- 工具类 API 定义 ---
export const Tip = {
  show: (message: string, type: TipType = 'info', duration = 3000) => {
    if (tipRef) tipRef.add({ message, type, duration });
  },
  success: (message: string, duration = 3000) => {
    if (tipRef) tipRef.add({ message, type: 'success', duration });
  },
  warning: (message: string, duration = 3000) => {
    if (tipRef) tipRef.add({ message, type: 'warning', duration });
  },
  error: (message: string, duration = 4000) => {
    if (tipRef) tipRef.add({ message, type: 'error', duration });
  },
  info: (message: string, duration = 3000) => {
    if (tipRef) tipRef.add({ message, type: 'info', duration });
  },
  config: (config: TipConfig) => {
    return {
      show: () => {
        if (tipRef) tipRef.add(config);
      },
    };
  },
};

// --- 组件部分 ---
interface ToastItem extends TipConfig {
  id: string;
}

export const GlobalTip: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 注册全局方法
  useEffect(() => {
    tipRef = {
      add: (config) => {
        const id = generateUniqueId();
        const newToast = { ...config, id };

        setToasts((prev) => {
          // 🎯 限制最多显示3个提醒
          const newToasts = [...prev, newToast];
          return newToasts.slice(-3); // 只保留最后3个
        });

        // 自动关闭逻辑
        if (config.duration !== 0) {
          setTimeout(() => {
            removeToast(id);
          }, config.duration || 3000);
        }
      },
      remove: (id) => removeToast(id),
    };

    return () => {
      tipRef = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 🎨 根据类型获取卡通风格样式
  const getStyle = (type?: TipType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="text-white" size={24} />,
          bg: 'bg-toon-blue',
          iconBg: 'bg-toon-blue',
        };
      case 'error':
        return {
          icon: <XCircle className="text-white" size={24} />,
          bg: 'bg-toon-red',
          iconBg: 'bg-toon-red',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="text-gray-900" size={24} />,
          bg: 'bg-toon-yellow',
          iconBg: 'bg-toon-yellow',
        };
      default:
        return {
          icon: <Info className="text-white" size={24} />,
          bg: 'bg-toon-purple',
          iconBg: 'bg-toon-purple',
        };
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[9999] pointer-events-none px-2 sm:px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {toasts.map((toast, index) => {
          const style = getStyle(toast.type);

          return (
            <div
              key={toast.id}
              className="pointer-events-auto w-full animate-in slide-in-from-bottom-4 fade-in duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`
                  flex items-center gap-3 sm:gap-4
                  p-3 sm:p-4
                  bg-white
                  border-4 border-black
                  rounded-2xl sm:rounded-3xl
                  shadow-toon
                  transition-all duration-300
                  hover:shadow-toon-lg
                  hover:-translate-y-1
                `}
              >
                {/* 图标容器 */}
                <div
                  className={`
                    ${style.iconBg}
                    flex items-center justify-center
                    w-12 h-12 sm:w-14 sm:h-14
                    rounded-full
                    border-3 border-black
                    shadow-toon-sm
                    flex-shrink-0
                  `}
                >
                  {style.icon}
                </div>

                {/* 消息内容 */}
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <h4 className="font-black text-gray-900 text-sm sm:text-base mb-1 truncate">
                      {toast.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-gray-700 font-bold leading-relaxed break-words">
                    {toast.message}
                  </p>
                </div>

                {/* 关闭按钮 */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="
                    flex items-center justify-center
                    w-8 h-8 sm:w-10 sm:h-10
                    bg-gray-100
                    hover:bg-gray-900
                    border-2 border-black
                    rounded-full
                    transition-all
                    group
                    flex-shrink-0
                    shadow-toon-sm
                    hover:shadow-toon
                    active:scale-95
                  "
                  aria-label="Close notification"
                >
                  <X size={16} className="text-gray-900 group-hover:text-white sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
