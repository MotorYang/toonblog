import { AlertCircle, KeyRound, Lock, RefreshCw, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { CaptchaResponse, LoginForm } from '@/types/auth.ts';
import { BusinessError } from '@/types/http.ts';

import { ToonButton } from './ToonButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (loginForm: LoginForm) => Promise<void>;
  onGetCaptcha: () => Promise<CaptchaResponse>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onGetCaptcha,
}) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);

  // 加载验证码
  const loadCaptcha = async () => {
    setIsRefreshingCaptcha(true);
    try {
      const captcha = await onGetCaptcha();
      setCaptchaId(captcha.captchaId);
      setCaptchaImage(captcha.image);
      setCaptchaCode('');
      setError('');
    } catch {
      setError(t('auth.error_captcha_load'));
    } finally {
      setIsRefreshingCaptcha(false);
    }
  };

  // 当模态框打开时加载验证码
  useEffect(() => {
    if (isOpen) {
      loadCaptcha();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('auth.error_fields'));
      return;
    }

    if (!captchaCode.trim()) {
      setError(t('auth.error_captcha_required'));
      return;
    }

    setIsLoading(true);
    try {
      const loginForm: LoginForm = {
        username: username,
        password: password,
        captcha: captchaCode,
        captchaId: captchaId,
      };
      await onLogin(loginForm);
      setUsername('');
      setPassword('');
      setCaptchaCode('');
      onClose();
    } catch (error) {
      if (error instanceof BusinessError) {
        if (error.code === 11001) {
          setError(t('login.account_failed'));
        } else if (error.code === 11002) {
          setError(t('auth.error_captcha_invalid'));
        } else {
          setError(error.message);
        }
        loadCaptcha();
      } else {
        setError(t('login.error_failed'));
        loadCaptcha();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setUsername('');
    setPassword('');
    setCaptchaCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4">
      {/* Modal Container - 更紧凑的设计 */}
      <div className="relative w-full max-w-sm bg-gradient-to-br from-white to-gray-50 border-4 border-black rounded-2xl shadow-toon-lg p-4 sm:p-6">
        {/* Close Button - 更小巧 */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 bg-white hover:bg-toon-red hover:text-white rounded-lg transition-all border-2 border-black shadow-toon-sm hover:shadow-toon active:scale-95 group"
          aria-label="关闭"
        >
          <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header - 简化设计 */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{t('login.title')}</h2>
          <p className="text-xs sm:text-sm font-bold text-gray-600">管理员登录验证</p>
        </div>

        {/* Form - 紧凑布局 */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Username Field */}
          <div>
            <label className="flex items-center gap-1.5 font-black text-sm sm:text-base mb-2 text-gray-900">
              <div className="bg-gradient-to-br from-toon-blue to-cyan-400 p-1 border-2 border-black rounded-md">
                <User size={14} className="text-white" />
              </div>
              {t('login.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-3 border-black rounded-lg p-2.5 sm:p-3 font-bold text-sm sm:text-base focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
              placeholder="admin"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="flex items-center gap-1.5 font-black text-sm sm:text-base mb-2 text-gray-900">
              <div className="bg-gradient-to-br from-toon-purple to-purple-500 p-1 border-2 border-black rounded-md">
                <Lock size={14} className="text-white" />
              </div>
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-3 border-black rounded-lg p-2.5 sm:p-3 font-bold text-sm sm:text-base focus:outline-none focus:border-toon-purple focus:shadow-toon-lg transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Captcha Field - 优化移动端布局 */}
          <div>
            <div className="flex gap-2">
              {/* 验证码输入框 */}
              <input
                type="text"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                className="flex-1 border-3 border-black rounded-lg p-2.5 sm:p-3 font-bold text-sm sm:text-base focus:outline-none focus:border-toon-green focus:shadow-toon-lg transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900 uppercase"
                placeholder={t('auth.captcha')}
                disabled={isLoading}
                maxLength={4}
              />

              {/* 验证码图片容器 - 响应式尺寸 */}
              <div className="relative flex-shrink-0 w-24 sm:w-28 h-10 sm:h-12 border-3 border-black rounded-lg overflow-hidden bg-white shadow-toon">
                {captchaImage ? (
                  <img src={captchaImage} alt="验证码" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <RefreshCw size={16} className="text-gray-400 animate-spin" />
                  </div>
                )}

                {/* 刷新按钮覆盖层 */}
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={isRefreshingCaptcha || isLoading}
                  className="absolute inset-0 bg-black/0 hover:bg-black/10 active:bg-black/20 transition-colors flex items-center justify-center group"
                  title="刷新验证码"
                >
                  <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-white/90 border-2 border-black rounded-md p-1">
                    <RefreshCw
                      size={14}
                      className={`text-gray-900 ${isRefreshingCaptcha ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* 验证码提示 - 更小的文字 */}
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 mt-1.5 flex items-center gap-1">
              <RefreshCw size={9} />
              点击图片可刷新
            </p>
          </div>

          {/* Error Message - 紧凑显示 */}
          {error && (
            <div className="bg-gradient-to-r from-toon-red to-red-400 text-white font-bold p-3 border-3 border-black rounded-lg flex items-center gap-2 shadow-toon-lg animate-in shake duration-500">
              <div className="bg-white border-2 border-black rounded-full p-1 flex-shrink-0">
                <AlertCircle size={16} className="text-toon-red" />
              </div>
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <ToonButton
              type="submit"
              className="w-full py-3 sm:py-3.5 text-base sm:text-lg shadow-toon-lg hover:shadow-toon-xl relative overflow-hidden group"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>{t('login.unlocking')}</span>
              ) : (
                <>
                  <KeyRound className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
                  <span>{t('login.unlock')}</span>
                </>
              )}
            </ToonButton>
          </div>
        </form>

        {/* Footer Hint - 简化设计 */}
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 text-center">
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 flex items-center justify-center gap-1.5">
            <Lock size={10} />
            安全的管理员认证系统
          </p>
        </div>
      </div>
    </div>
  );
};
