import {
  CaptchaResponse,
  LoginForm,
  type TokenRefreshResponse,
  UserLoginResponse,
} from '@/types/auth';
import http from '@/utils/request/http';

export const authApi = {
  /**
   * 用户登录
   */
  login: async (payload: LoginForm): Promise<UserLoginResponse> =>
    await http.post<UserLoginResponse, LoginForm>('/system/auth/login', payload),

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => await http.get<void>('/system/auth/logout'),

  /**
   * 刷新Token
   */
  refreshToken: async (payload: string): Promise<TokenRefreshResponse> => {
    return await http.post<TokenRefreshResponse>('/system/auth/refresh', {
      refreshToken: payload,
    });
  },

  /**
   * 获取验证码
   */
  getCaptcha: async (): Promise<CaptchaResponse> =>
    await http.get<CaptchaResponse>('/system/auth/captcha'),
};
