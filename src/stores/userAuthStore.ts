// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Tip } from '@/components/GlobalTip';
import { translate } from '@/context/LanguageContext';
import { userService } from '@/services/userService';
import type {
  CaptchaResponse,
  LoginForm,
  TokenRefreshResponse,
  User,
  UserLoginResponse,
} from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  isRefreshing: boolean; // ✅ 新增：是否正在刷新token
  tokenExpiresAt: number | null;
  refreshTimerId: NodeJS.Timeout | null;

  captcha: () => Promise<CaptchaResponse>;
  isLoggedIn: () => boolean;
  isTokenExpired: () => boolean;
  login: (loginForm: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (userLoginResponse: UserLoginResponse | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void; // ✅ 新增
  refreshAccessToken: () => Promise<string>; // ✅ 修改返回类型
  checkAndRefreshToken: () => Promise<boolean>;
  scheduleTokenRefresh: () => void;
}

// Token 过期前提前刷新的时间(5分钟)
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;

// ✅ 请求队列：用于在刷新token期间暂存失败的请求
let refreshPromise: Promise<string> | null = null;

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAdmin: false,
      isLoading: false,
      isRefreshing: false, // ✅ 初始化
      tokenExpiresAt: null,
      refreshTimerId: null,

      isLoggedIn: () => {
        const { user, accessToken } = get();
        return !!user && !!accessToken;
      },

      isTokenExpired: () => {
        const { tokenExpiresAt } = get();
        if (!tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt;
      },

      captcha: async (): Promise<CaptchaResponse> => {
        return await userService.getCaptcha();
      },

      login: async (loginForm: LoginForm) => {
        set({ isLoading: true });
        try {
          const result: UserLoginResponse = await userService.login(loginForm);
          // 处理角色信息
          const roles = Array.isArray(result.userInfo.roles) ? result.userInfo.roles : [];
          const isAdminUser = roles.includes('admin');

          // 计算 token 过期时间
          const expiresAt = result.expiresIn
            ? Date.now() + result.expiresIn * 1000
            : Date.now() + 24 * 60 * 60 * 1000;
          set({
            user: result.userInfo,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isAdmin: isAdminUser,
            tokenExpiresAt: expiresAt,
          });
          // 启动自动刷新 token 的定时器
          get().scheduleTokenRefresh();
          Tip.success(translate('auth.login.success') + result.userInfo.nickName);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { accessToken, refreshTimerId } = get();

        try {
          // 调用后端登出接口(如果有token)
          if (accessToken) {
            await userService.logout();
          }
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // 清除定时器
          if (refreshTimerId !== null) {
            clearTimeout(refreshTimerId);
          }

          // ✅ 清除刷新Promise
          refreshPromise = null;

          // 清理所有认证状态
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAdmin: false,
            isRefreshing: false,
            tokenExpiresAt: null,
            refreshTimerId: null,
          });

          Tip.success(translate('auth.logout.success'));
        }
      },

      setUser: (loginResponse: UserLoginResponse | null) => {
        const isAdmin = loginResponse?.userInfo?.roles?.includes('admin') ?? false;
        const user = loginResponse?.userInfo;
        set({ user, isAdmin });
      },

      // 更新tokens的方法
      setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
        // 计算新的过期时间（这里假设24小时，实际应该从后端返回）
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiresAt: expiresAt,
        });

        // 重新安排下次刷新
        get().scheduleTokenRefresh();
      },

      // 返回新的accessToken，支持防重复刷新
      refreshAccessToken: async (): Promise<string> => {
        const { refreshToken, isRefreshing } = get();

        // 如果正在刷新，返回现有的Promise
        if (isRefreshing && refreshPromise) {
          return refreshPromise;
        }

        // 没有refreshToken，直接失败
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 标记正在刷新
        set({ isRefreshing: true });

        // 创建刷新Promise
        refreshPromise = (async () => {
          try {
            const result: TokenRefreshResponse = await userService.refreshToken();

            // 计算新的过期时间
            const expiresAt = result.expiresIn
              ? Date.now() + result.expiresIn * 1000
              : Date.now() + 24 * 60 * 60 * 1000;

            set({
              accessToken: result.accessToken,
              refreshToken: result.refreshToken || refreshToken,
              tokenExpiresAt: expiresAt,
            });

            // 重新安排下次刷新
            get().scheduleTokenRefresh();

            console.log('Token refreshed successfully');

            // 返回新的accessToken
            return result.accessToken;
          } catch (error) {
            console.error('Token refresh failed:', error);

            // Token 刷新失败,清理状态并提示用户重新登录
            Tip.error(translate('auth.session.expired'));
            await get().logout();

            throw error;
          } finally {
            // 刷新完成，重置状态
            set({ isRefreshing: false });
            refreshPromise = null;
          }
        })();

        return refreshPromise;
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
            get().refreshAccessToken().catch(console.error);
          }, timeUntilRefresh);

          set({ refreshTimerId: timerId });
        } else {
          // 如果已经在刷新阈值内,立即刷新
          get().refreshAccessToken().catch(console.error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAdmin: state.isAdmin,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.tokenExpiresAt) {
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
