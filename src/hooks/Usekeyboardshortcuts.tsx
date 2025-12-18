import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === e.ctrlKey;
        const metaMatch = shortcut.metaKey === undefined || shortcut.metaKey === e.metaKey;
        const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === e.shiftKey;
        const keyMatch = e.key === shortcut.key;

        if (ctrlMatch && metaMatch && shiftMatch && keyMatch) {
          // 防止在输入框中触发
          const target = e.target as HTMLElement;
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
          ) {
            // 除了 Escape 键，其他快捷键在输入框中不生效
            if (e.key !== 'Escape') {
              return;
            }
          }

          e.preventDefault();
          shortcut.handler();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// 快捷键提示组件
export const KeyboardShortcutHint: React.FC<{
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line react/prop-types
}> = ({ shortcuts, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black rounded-2xl shadow-toon-xl max-w-md w-full mx-4 animate-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-gray-900">⌨️ 键盘快捷键</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* eslint-disable-next-line react/prop-types */}
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black rounded-lg"
              >
                <span className="font-bold text-sm text-gray-700">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 bg-white border-2 border-black rounded-md font-black text-xs shadow-toon-sm">
                  {shortcut.ctrlKey && 'Ctrl + '}
                  {shortcut.metaKey && 'Cmd + '}
                  {shortcut.shiftKey && 'Shift + '}
                  {shortcut.key.toUpperCase()}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-toon-yellow/20 border-2 border-toon-yellow rounded-lg">
            <p className="text-xs font-bold text-gray-700">
              💡 按{' '}
              <kbd className="px-2 py-0.5 bg-white border-2 border-black rounded font-black">?</kbd>{' '}
              可随时查看快捷键
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
