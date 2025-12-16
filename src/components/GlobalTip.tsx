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
  id: string; // 🔧 改为 string 类型
}

export const GlobalTip: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 注册全局方法
  useEffect(() => {
    tipRef = {
      add: (config) => {
        const id = generateUniqueId(); // 🔧 使用唯一 ID 生成器
        const newToast = { ...config, id };

        setToasts((prev) => [...prev, newToast]);

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

  // 根据类型获取图标和颜色
  const getStyle = (type?: TipType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="text-green-500" />,
          border: 'border-green-500',
          bg: 'bg-green-50',
        };
      case 'error':
        return {
          icon: <XCircle className="text-red-500" />,
          border: 'border-red-500',
          bg: 'bg-red-50',
        };
      case 'warning':
        return {
          icon: <AlertCircle className="text-yellow-500" />,
          border: 'border-yellow-500',
          bg: 'bg-yellow-50',
        };
      default:
        return {
          icon: <Info className="text-blue-500" />,
          border: 'border-blue-500',
          bg: 'bg-blue-50',
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const style = getStyle(toast.type);

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              min-w-[300px] max-w-sm
              flex items-start gap-3 p-4
              bg-white rounded-xl shadow-2xl
              border-l-8 ${style.border}
              transform transition-all duration-300 ease-in-out
              animate-in slide-in-from-right-full fade-in
            `}
          >
            <div className="mt-0.5 shrink-0">{style.icon}</div>

            <div className="flex-1">
              {toast.title && (
                <h4 className="font-bold text-gray-800 text-sm mb-1">{toast.title}</h4>
              )}
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
