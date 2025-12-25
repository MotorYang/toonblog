import {
  BarChart3,
  Ghost,
  Github,
  Home,
  LogIn,
  LogOut,
  Menu,
  Package,
  PenTool,
  Pickaxe,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
  const { user, isAdmin, login, logout, captcha } = userAuthStore();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Performance metrics state
  const [pageSize, setPageSize] = useState<number>(0);
  const [loadTime, setLoadTime] = useState<number>(0);

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

  // Calculate performance metrics
  useEffect(() => {
    // Calculate page size
    const calculatePageSize = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const totalSize = resources.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0);
      }, 0);
      setPageSize(Math.round(totalSize / 1024)); // Convert to KB
    };

    // Calculate load time
    const calculateLoadTime = () => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        setLoadTime(Math.round(loadTime));
      }
    };

    // Run after page load
    if (document.readyState === 'complete') {
      calculatePageSize();
      calculateLoadTime();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          calculatePageSize();
          calculateLoadTime();
        }, 100);
      });
    }
  }, [location.pathname]);

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
                  <span>{user.nickName}</span>
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
                    <span>{user.nickName}</span>
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

      <footer className="p-3 md:p-4 text-center relative text-gray-900 mb-20 sm:mb-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Footer Card */}
          <div className="inline-block bg-white border-2 md:border-3 border-black rounded-xl md:rounded-2xl overflow-hidden">
            {/* Top Section - GitHub & Copyright */}
            <div className="px-4 md:px-6 py-3 bg-gradient-to-r from-toon-purple to-toon-blue border-b-2 border-black">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <a
                  href="https://github.com/motoryang/toonblog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-black text-white border-2 border-black rounded-lg hover:bg-gray-800 transition-all hover:scale-105 font-bold text-xs md:text-sm group"
                >
                  <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>ToonBlog</span>
                </a>
                <div className="hidden sm:block w-[2px] h-4 bg-black/30"></div>
                <span className="font-black text-xs md:text-sm text-white">
                  © {new Date().getFullYear()} Built with MotorYang
                </span>
              </div>
            </div>

            {/* Bottom Section - Performance Metrics */}
            <div className="px-3 md:px-4 py-2 bg-gray-50">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs">
                {/* Builders */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-toon-purple border-2 border-black rounded-lg">
                  <Pickaxe className="w-3.5 h-3.5" />
                  <span className="font-bold">React + Vite</span>
                </div>
                {/* Page Size */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-toon-yellow border-2 border-black rounded-lg">
                  <Package className="w-3.5 h-3.5" />
                  <span className="font-bold">{pageSize}KB</span>
                </div>

                {/* Load Time */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-toon-blue border-2 border-black rounded-lg">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="font-bold">{loadTime}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
        onGetCaptcha={captcha}
      />

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
