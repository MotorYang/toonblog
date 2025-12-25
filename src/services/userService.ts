import { authApi } from '@/api/auth';
import { userAuthStore } from '@/stores/userAuthStore';
import type {
  CaptchaResponse,
  LoginForm,
  TokenRefreshResponse,
  UserLoginResponse,
} from '@/types/auth';

export const userService = {
  /**
   * 用户登录
   */
  login(loginForm: LoginForm): Promise<UserLoginResponse> {
    return authApi.login(loginForm);
  },

  /**
   * 用户登出
   */
  logout(): Promise<void> {
    return authApi.logout();
  },

  /**
   * 刷新访问令牌
   * @throws {Error} 当 refreshToken 不存在时抛出错误
   */
  refreshToken(): Promise<TokenRefreshResponse> {
    const { refreshToken } = userAuthStore.getState();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return authApi.refreshToken(refreshToken);
  },

  /**
   * 获取验证码
   */
  getCaptcha(): Promise<CaptchaResponse> {
    return authApi.getCaptcha();
  },
} as const;
