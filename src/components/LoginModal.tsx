import { AlertCircle, KeyRound, Lock, User, X } from 'lucide-react';
import React, { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { BusinessError } from '@/types/http.ts';

import { ToonButton } from './ToonButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('login.error_fields'));
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(username, password);
      // Reset form on success
      setUsername('');
      setPassword('');
      onClose();
    } catch (error) {
      if (error instanceof BusinessError) {
        if (error.code === 11001) {
          setError(t('login.account_failed'));
        } else {
          setError(error.message);
        }
      } else {
        setError(t('login.error_failed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Modal Container - 优化容器 */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 border-4 border-black rounded-3xl shadow-toon-lg p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button - 优化关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-white hover:bg-toon-red hover:text-white rounded-xl transition-all border-3 border-black shadow-toon-sm hover:shadow-toon active:scale-95 group"
          aria-label="关闭"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header - 重新设计标题区 */}
        <div className="text-center mb-8">
          {/* Icon Container - 优化图标容器 */}
          <div
            className="inline-block relative mb-4 animate-in zoom-in duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <div className="absolute inset-0 bg-toon-yellow/30 blur-xl rounded-full animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-toon-yellow to-yellow-300 p-4 border-3 border-black rounded-2xl shadow-toon">
              <KeyRound size={40} className="text-gray-900" />
            </div>
          </div>

          {/* Title - 优化标题 */}
          <h2
            className="text-3xl md:text-4xl font-black text-gray-900 mb-2 animate-in slide-in-from-top-4 duration-500"
            style={{ animationDelay: '200ms' }}
          >
            {t('login.title')}
          </h2>
          <p
            className="text-sm font-bold text-gray-600 animate-in fade-in duration-500"
            style={{ animationDelay: '300ms' }}
          >
            管理员登录验证
          </p>
        </div>

        {/* Form - 优化表单 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field - 优化用户名输入 */}
          <div
            className="animate-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: '400ms' }}
          >
            <label className="flex items-center gap-2 font-black text-base md:text-lg mb-3 text-gray-900">
              <div className="bg-gradient-to-br from-toon-blue to-cyan-400 p-1.5 border-2 border-black rounded-lg">
                <User size={16} className="text-white" />
              </div>
              {t('login.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 md:p-4 font-bold text-base md:text-lg focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
              placeholder="admin"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Password Field - 优化密码输入 */}
          <div
            className="animate-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: '500ms' }}
          >
            <label className="flex items-center gap-2 font-black text-base md:text-lg mb-3 text-gray-900">
              <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-1.5 border-2 border-black rounded-lg">
                <Lock size={16} className="text-white" />
              </div>
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 md:p-4 font-bold text-base md:text-lg focus:outline-none focus:border-toon-purple focus:shadow-toon-lg transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Error Message - 优化错误提示 */}
          {error && (
            <div className="bg-gradient-to-r from-toon-red to-red-400 text-white font-bold p-4 border-3 border-black rounded-xl flex items-center gap-3 shadow-toon-lg animate-in shake duration-500">
              <div className="bg-white border-2 border-black rounded-full p-1.5 flex-shrink-0">
                <AlertCircle size={20} className="text-toon-red" />
              </div>
              <span className="text-sm md:text-base">{error}</span>
            </div>
          )}

          {/* Submit Button - 优化提交按钮 */}
          <div
            className="pt-2 animate-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: '600ms' }}
          >
            <ToonButton
              type="submit"
              className="w-full py-4 text-lg md:text-xl shadow-toon-lg hover:shadow-toon-xl relative overflow-hidden group"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>{t('login.unlocking')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 group-hover:rotate-12 transition-transform" size={24} />
                  <span>{t('login.unlock')}</span>
                </>
              )}
            </ToonButton>
          </div>
        </form>

        {/* Footer Hint - 添加底部提示 */}
        <div
          className="mt-6 pt-6 border-t-2 border-dashed border-gray-300 text-center animate-in fade-in duration-500"
          style={{ animationDelay: '700ms' }}
        >
          <p className="text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
            <Lock size={12} />
            安全的管理员认证系统
          </p>
        </div>
      </div>
    </div>
  );
};
