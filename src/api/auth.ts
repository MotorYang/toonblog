import {
  CaptchaResponse,
  LoginForm,
  type TokenRefreshResponse,
  UserLoginResponse,
} from '@/types/auth';
import http from '@/utils/request/http';

// ==================== Token 管理 ====================

const REFRESH_TOKEN_KEY = 'refresh_token';

/** 获取 Refresh Token */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns Promise<UserLoginResponse>
 */
export function login(params: LoginForm): Promise<UserLoginResponse> {
  return http.post<UserLoginResponse, LoginForm>('/system/auth/login', params);
}

/**
 * 用户登出
 * @returns Promise<void>
 */
export function logout(): Promise<void> {
  return http.get<void>('/system/auth/logout');
}

/**
 * 刷新 Token
 * @returns Promise<string> 返回新的 token
 */
export async function refreshToken(): Promise<TokenRefreshResponse> {
  const oldRefreshToken = getRefreshToken();

  if (!oldRefreshToken) {
    throw new Error('Refresh token not found');
  }

  return await http.post<TokenRefreshResponse>('/system/auth/refresh', {
    refreshToken: oldRefreshToken,
  });
}

/**
 * 获取验证码
 * @returns Promise<CaptchaResponse>
 */
export function getCaptcha(): Promise<CaptchaResponse> {
  return http.get<CaptchaResponse>('/system/auth/captcha');
}

// ==================== 默认导出 ====================

export default {
  refreshToken,
};
