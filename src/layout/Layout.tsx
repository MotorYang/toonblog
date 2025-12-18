import { BarChart3, Ghost, Home, LogIn, LogOut, Menu, PenTool, Settings, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '@/context/LanguageContext.tsx';
import { userAuthStore } from '@/stores/userAuthStore.ts';

import { ConfirmDialog } from '../components/ConfirmDialog.tsx';
import { GlobalTip } from '../components/GlobalTip.tsx';
import { GlobalToolbox } from '../components/GlobalToolbox.tsx';
import { LanguageSelector } from '../components/LanguageSelector.tsx';
import { LoginModal } from '../components/LoginModal.tsx';
import { ThemeSelector } from '../components/ThemeSelector.tsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, login, logout } = userAuthStore();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (location.pathname.startsWith('/post/')) return '/' === path;
    return location.pathname === path;
  };

  const activeClass = 'bg-toon-yellow text-toon-ink shadow-toon-hover';
  const inactiveClass = 'bg-white text-gray-900 hover:bg-gray-50';

  const activeClassAdmin = 'bg-toon-blue text-toon-ink shadow-toon-hover';
  const activeClassDashboard = 'bg-toon-red text-toon-ink shadow-toon-hover';
  const activeClassSettings = 'bg-toon-purple text-toon-ink shadow-toon-hover';

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout().then(() => {
      navigate('/');
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="sticky top-0 z-40 px-2 py-2 md:px-4 md:py-3">
        <div className="max-w-6xl mx-auto bg-white border-2 md:border-4 border-black rounded-2xl shadow-toon transition-all duration-300">
          {/* Desktop Header */}
          <div className="hidden md:flex px-4 py-3 items-center">
            {/* Logo - 靠左 */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-toon-purple p-2 border-2 border-black rounded-lg group-hover:rotate-12 transition-transform">
                <Ghost className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">ToonBlog</span>
            </Link>

            {/* Spacer - 占据剩余空间 */}
            <div className="flex-1"></div>

            {/* 所有功能按钮 - 靠右对齐 */}
            <div className="flex items-center gap-2">
              {/* Theme & Language */}
              <LanguageSelector />
              <ThemeSelector />

              <div className="w-[2px] h-8 bg-black"></div>

              {/* Navigation Links */}
              <Link to="/">
                <button
                  className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/') ? activeClass : inactiveClass}`}
                  title={t('nav.home')}
                >
                  <Home className="w-6 h-6" />
                </button>
              </Link>

              {isAdmin && (
                <>
                  <Link to="/create">
                    <button
                      className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/create') ? activeClassAdmin : inactiveClass}`}
                      title={t('nav.create')}
                    >
                      <PenTool className="w-6 h-6" />
                    </button>
                  </Link>
                  <Link to="/dashboard">
                    <button
                      className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/dashboard') ? activeClassDashboard : inactiveClass}`}
                      title={t('nav.dashboard')}
                    >
                      <BarChart3 className="w-6 h-6" />
                    </button>
                  </Link>
                  <Link to="/settings">
                    <button
                      className={`p-2 border-2 border-black rounded-lg transition-all ${isActive('/settings') ? activeClassSettings : inactiveClass}`}
                      title={t('nav.settings')}
                    >
                      <Settings className="w-6 h-6" />
                    </button>
                  </Link>
                </>
              )}

              <div className="w-[2px] h-8 bg-black"></div>

              {user ? (
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-red-100 transition-colors font-bold text-sm text-gray-900"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 border-2 border-black rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-bold text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav.login')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden px-3 py-2 flex items-center justify-between gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
              <div className="bg-toon-purple p-1.5 border-2 border-black rounded-lg group-hover:rotate-12 transition-transform">
                <Ghost className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">ToonBlog</span>
            </Link>

            {/* Theme & Language & Menu Button */}
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeSelector />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 border-2 border-black rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-900" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-900" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t-2 border-black bg-gradient-to-br from-white to-gray-50 animate-in slide-in-from-top-2 fade-in duration-200 overflow-hidden rounded-b-2xl">
              <div className="p-4 space-y-3">
                {/* Navigation Links */}
                <Link to="/" onClick={closeMobileMenu}>
                  <button
                    className={`w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg transition-all ${
                      isActive('/') ? activeClass : inactiveClass
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-bold text-sm">{t('nav.home')}</span>
                  </button>
                </Link>

                {isAdmin && (
                  <>
                    <Link to="/create" onClick={closeMobileMenu}>
                      <button
                        className={`w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg transition-all ${
                          isActive('/create') ? activeClassAdmin : inactiveClass
                        }`}
                      >
                        <PenTool className="w-5 h-5" />
                        <span className="font-bold text-sm">{t('nav.create')}</span>
                      </button>
                    </Link>
                    <Link to="/dashboard" onClick={closeMobileMenu}>
                      <button
                        className={`w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg transition-all ${
                          isActive('/dashboard') ? activeClassDashboard : inactiveClass
                        }`}
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-bold text-sm">{t('nav.dashboard')}</span>
                      </button>
                    </Link>
                    <Link to="/settings" onClick={closeMobileMenu}>
                      <button
                        className={`w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg transition-all ${
                          isActive('/settings') ? activeClassSettings : inactiveClass
                        }`}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-bold text-sm">{t('nav.settings')}</span>
                      </button>
                    </Link>
                  </>
                )}

                {/* Auth Button */}
                {user ? (
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg bg-gray-100 hover:bg-red-100 transition-colors font-bold text-sm text-gray-900"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{user.name}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 p-3 border-2 border-black rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-bold text-sm"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{t('nav.login')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-2 py-2 md:px-4 md:py-3 relative z-10 text-gray-900">
        <div key={location.pathname} className="animate-pop-in h-full">
          {children}
        </div>
      </main>

      <footer className="mt-6 md:mt-8 p-3 md:p-6 text-center relative text-gray-900 mb-20 sm:mb-4">
        <div className="inline-block bg-white border-2 md:border-4 border-black rounded-full px-4 md:px-6 py-2 text-sm md:text-base font-bold shadow-toon">
          © {new Date().getFullYear()} ToonBlog • Built with MotorYang
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
