import { BarChart3, Ghost, Home, LogIn, LogOut, PenTool, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';

import { ConfirmDialog } from './ConfirmDialog';
import { GlobalTip } from './GlobalTip';
import { GlobalToolbox } from './GlobalToolbox';
import { LanguageSelector } from './LanguageSelector';
import { LoginModal } from './LoginModal';
import { ThemeSelector } from './ThemeSelector';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, login, logout } = userAuthStore();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Active state uses brand colors, so we need text-toon-ink. Inactive uses theme colors (white bg, gray text).
  const activeClass = 'bg-toon-yellow text-toon-ink shadow-toon-hover';
  const inactiveClass = 'bg-white text-gray-900 hover:bg-gray-50';

  const activeClassAdmin = 'bg-toon-blue text-toon-ink shadow-toon-hover';
  const activeClassDashboard = 'bg-toon-red text-toon-ink shadow-toon-hover';
  const activeClassSettings = 'bg-toon-purple text-toon-ink shadow-toon-hover';

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-40 p-2 md:p-4">
        <div className="max-w-4xl mx-auto bg-white border-2 md:border-4 border-black rounded-2xl shadow-toon px-3 py-2 md:px-6 md:py-4 flex flex-wrap gap-2 md:gap-4 items-center justify-between relative transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group mr-auto">
            <div className="bg-toon-purple p-1.5 md:p-2 border-2 border-black rounded-lg group-hover:rotate-12 transition-transform">
              <Ghost className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter hidden sm:inline text-gray-900">
              ToonBlog
            </span>
          </Link>

          {/* Compact Nav Controls */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeSelector />
          </div>

          <div className="w-[2px] h-6 md:h-8 bg-black"></div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <button
                className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/') ? activeClass : inactiveClass}`}
                title={t('nav.home')}
              >
                <Home className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </Link>

            {isAdmin && (
              <>
                <Link to="/create">
                  <button
                    className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/create') ? activeClassAdmin : inactiveClass}`}
                    title={t('nav.create')}
                  >
                    <PenTool className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button
                    className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/dashboard') ? activeClassDashboard : inactiveClass}`}
                    title={t('nav.dashboard')}
                  >
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </Link>
                <Link to="/settings">
                  <button
                    className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/settings') ? activeClassSettings : inactiveClass}`}
                    title={t('nav.settings')}
                  >
                    <Settings className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </Link>
              </>
            )}

            <div className="w-[2px] h-6 md:h-8 bg-black hidden sm:block"></div>

            {user ? (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-red-100 transition-colors font-bold text-xs md:text-sm text-gray-900"
                title={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 border-2 border-black rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-bold text-xs md:text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-2 md:p-4 relative z-10 text-gray-900">
        <div key={location.pathname} className="animate-pop-in h-full">
          {children}
        </div>
      </main>

      <footer className="mt-8 md:mt-12 p-4 md:p-8 text-center relative z-10 text-gray-900">
        <div className="inline-block bg-white border-2 md:border-4 border-black rounded-full px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-toon">
          © {new Date().getFullYear()} ToonBlog • Built with Fun
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={login} />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogoutConfirm}
        message={t('auth.logout.message')}
        variant="danger"
      />

      <GlobalToolbox />
      <GlobalTip />
    </div>
  );
};
