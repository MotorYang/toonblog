// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Tip } from '@/components/GlobalTip';
import { translate } from '@/context/LanguageContext';
import { userService } from '@/services/userService';
import type { TokenRefreshResponse, User, UserLoginResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  tokenExpiresAt: number | null;
  refreshTimerId: NodeJS.Timeout | null;

  isLoggedIn: () => boolean;
  isTokenExpired: () => boolean;
  login: (account: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (userLoginResponse: UserLoginResponse | null) => void;
  refreshAccessToken: () => Promise<void>;
  checkAndRefreshToken: () => Promise<boolean>;
  scheduleTokenRefresh: () => void;
}

// Token 过期前提前刷新的时间(5分钟)
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAdmin: false,
      isLoading: false,
      tokenExpiresAt: null,
      refreshTimerId: null,

      isLoggedIn: () => {
        const { user, token } = get();
        return !!user && !!token;
      },

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt;
      },

      login: async (account: string, password: string) => {
        set({ isLoading: true });
        try {
          const result: UserLoginResponse = await userService.login({
            account,
            password,
          });
          // 处理角色信息
          const roles = Array.isArray(result.roles) ? result.roles : [];
          const isAdminUser = roles.includes('admin');

          // 计算 token 过期时间
          const expiresAt = result.expiresIn
            ? Date.now() + result.expiresIn * 1000
            : Date.now() + 24 * 60 * 60 * 1000;
          set({
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken,
            isAdmin: isAdminUser,
            tokenExpiresAt: expiresAt,
          });
          // 启动自动刷新 token 的定时器
          get().scheduleTokenRefresh();
          Tip.success(translate('auth.login.success') + result.user.name);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { token, refreshTimerId } = get();

        try {
          // 调用后端登出接口(如果有token)
          if (token) {
            await userService.logout();
          }
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // 🔧 修复: 先检查是否为 null 再清除定时器
          if (refreshTimerId !== null) {
            clearTimeout(refreshTimerId);
          }

          // 清理所有认证状态
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAdmin: false,
            tokenExpiresAt: null,
            refreshTimerId: null,
          });

          Tip.success(translate('auth.logout.success'));
        }
      },

      setUser: (loginResponse: UserLoginResponse | null) => {
        const isAdmin = loginResponse?.roles?.includes('admin') ?? false;
        const user = loginResponse?.user;
        set({ user, isAdmin });
      },

      refreshAccessToken: async () => {
        const { refreshToken, isLoading } = get();

        // 防止重复刷新
        if (isLoading || !refreshToken) {
          return;
        }

        set({ isLoading: true });
        try {
          const result: TokenRefreshResponse = await userService.refreshToken();

          // 计算新的过期时间
          const expiresAt = result.expiresIn
            ? Date.now() + result.expiresIn * 1000
            : Date.now() + 24 * 60 * 60 * 1000;

          set({
            token: result.token,
            refreshToken: result.refreshToken || refreshToken,
            tokenExpiresAt: expiresAt,
          });

          // 重新安排下次刷新
          get().scheduleTokenRefresh();

          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);

          // Token 刷新失败,清理状态并提示用户重新登录
          Tip.error(translate('auth.session.expired'));
          await get().logout();

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      checkAndRefreshToken: async () => {
        const { isLoggedIn, isTokenExpired, tokenExpiresAt } = get();

        if (!isLoggedIn()) {
          return false;
        }

        // 如果 token 已过期
        if (isTokenExpired()) {
          try {
            await get().refreshAccessToken();
            return true;
          } catch {
            return false;
          }
        }

        // 如果 token 即将过期(在阈值内),主动刷新
        if (tokenExpiresAt && tokenExpiresAt - Date.now() < TOKEN_REFRESH_THRESHOLD) {
          try {
            await get().refreshAccessToken();
          } catch (error) {
            console.error('Proactive token refresh failed:', error);
          }
        }

        return true;
      },

      scheduleTokenRefresh: () => {
        const { tokenExpiresAt, refreshTimerId } = get();

        if (refreshTimerId !== null) {
          clearTimeout(refreshTimerId);
        }

        if (!tokenExpiresAt) return;

        // 计算刷新时间: 在过期前 5 分钟刷新
        const timeUntilRefresh = tokenExpiresAt - Date.now() - TOKEN_REFRESH_THRESHOLD;

        if (timeUntilRefresh > 0) {
          const timerId = setTimeout(() => {
            get().refreshAccessToken().then();
          }, timeUntilRefresh);

          set({ refreshTimerId: timerId });
        } else {
          // 如果已经在刷新阈值内,立即刷新
          get().refreshAccessToken().then();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAdmin: state.isAdmin,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.tokenExpiresAt) {
          if (state.tokenExpiresAt > Date.now()) {
            state.scheduleTokenRefresh();
          } else {
            state.refreshAccessToken().catch(() => {
              state.logout();
            });
          }
        }
      },
    },
  ),
);
