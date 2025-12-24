import { getCaptcha, login, logout, refreshToken } from '@/api/auth';
import { CaptchaResponse, LoginForm, TokenRefreshResponse, UserLoginResponse } from '@/types/auth';

export const userService = {
  login: async (loginForm: LoginForm): Promise<UserLoginResponse> => await login(loginForm),
  logout: async (): Promise<void> => await logout(),
  refreshToken: async (): Promise<TokenRefreshResponse> => await refreshToken(),
  captcha: async (): Promise<CaptchaResponse> => await getCaptcha(),
};
