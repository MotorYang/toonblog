import { type TokenRefreshResponse, UserLoginResponse } from '@/types/auth';
import http from '@/utils/request/http';

// ==================== 类型定义 ====================

/** 登录请求参数 */
export interface LoginParams {
  account: string; // 账号（用户名）
  password: string; // 密码
  captcha?: string; // 验证码（可选）
  captchaId?: string; // 验证码ID（可选）
}

/** 用户信息 */
export interface UserInfo {
  id: string;
  name: string; // 姓名
  account: string; // 账号
  phone: string; // 手机号
  gender: string; // 性别
  city: string; // 城市
  email: string; // 邮箱
}

/** 注册请求参数 */
export interface RegisterParams {
  name: string;
  account: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
  gender?: string; // 可选
  city?: string; // 可选
  captcha?: string;
  captchaId?: string;
}

/** 刷新 Token 响应 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/** 修改密码请求参数 */
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** 重置密码请求参数 */
export interface ResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

/** 更新用户信息请求参数 */
export interface UpdateUserInfoParams {
  name?: string;
  phone?: string;
  gender?: string;
  city?: string;
  email?: string;
}

// ==================== Token 管理 ====================

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

/** 保存 Token */
export function saveToken(token: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/** 获取 Token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** 获取 Refresh Token */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** 保存用户信息 */
export function saveUserInfo(userInfo: UserInfo): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

/** 获取用户信息 */
export function getUserInfoFromStorage(): UserInfo | null {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) return null;

  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch {
    return null;
  }
}

/** 清除 Token 和用户信息 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

// ==================== API 请求函数 ====================

/**
 * 用户登录
 * @param params 登录参数
 * @returns Promise<UserLoginResponse>
 */
export function login(params: LoginParams): Promise<UserLoginResponse> {
  return http.post<UserLoginResponse, LoginParams>('/system/auth/login', params);
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns Promise<UserInfo>
 */
export function register(params: RegisterParams): Promise<UserInfo> {
  return http.post<UserInfo, RegisterParams>('/system/auth/register', params);
}

/**
 * 用户登出
 * @returns Promise<void>
 */
export function logout(): Promise<void> {
  return http.post<void>('/system/auth/logout');
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

  return await http.post<RefreshTokenResponse>('/system/auth/refresh', {
    refreshToken: oldRefreshToken,
  });
}

/**
 * 获取当前用户信息
 * @returns Promise<UserInfo>
 */
export function getUserInfo(): Promise<UserInfo> {
  return http.get<UserInfo>('/system/auth/user/info');
}

/**
 * 更新用户信息
 * @param params 更新参数
 * @returns Promise<UserInfo>
 */
export function updateUserInfo(params: UpdateUserInfoParams): Promise<UserInfo> {
  return http.put<UserInfo, UpdateUserInfoParams>('/system/auth/user/info', params);
}

/**
 * 修改密码
 * @param params 修改密码参数
 * @returns Promise<void>
 */
export function changePassword(params: ChangePasswordParams): Promise<void> {
  return http.post<void, ChangePasswordParams>('/system/auth/password/change', params);
}

/**
 * 发送重置密码邮件
 * @param email 邮箱地址
 * @returns Promise<void>
 */
export function sendResetPasswordEmail(email: string): Promise<void> {
  return http.post<void>('/system/auth/password/reset/email', { email });
}

/**
 * 重置密码
 * @param params 重置密码参数
 * @returns Promise<void>
 */
export function resetPassword(params: ResetPasswordParams): Promise<void> {
  return http.post<void, ResetPasswordParams>('/system/auth/password/reset', params);
}

/**
 * 获取验证码
 * @returns Promise<{ captchaId: string; captchaImage: string }>
 */
export function getCaptcha(): Promise<{ captchaId: string; captchaImage: string }> {
  return http.get<{ captchaId: string; captchaImage: string }>('/auth/captcha');
}

/**
 * 验证 Token 是否有效
 * @returns Promise<boolean>
 */
export async function validateToken(): Promise<boolean> {
  try {
    await http.get<{ valid: boolean }>('/system/auth/validate');
    return true;
  } catch {
    return false;
  }
}

/**
 * 根据手机号查询用户
 * @param phone 手机号
 * @returns Promise<UserInfo | null>
 */
export function getUserByPhone(phone: string): Promise<UserInfo | null> {
  return http.get<UserInfo | null>(`/system/auth/user/phone/${phone}`);
}

/**
 * 根据邮箱查询用户
 * @param email 邮箱
 * @returns Promise<UserInfo | null>
 */
export function getUserByEmail(email: string): Promise<UserInfo | null> {
  return http.get<UserInfo | null>(`/system/auth/user/email/${email}`);
}

/**
 * 根据账号查询用户
 * @param account 账号
 * @returns Promise<UserInfo | null>
 */
export function getUserByAccount(account: string): Promise<UserInfo | null> {
  return http.get<UserInfo | null>(`/system/auth/user/account/${account}`);
}

// ==================== 默认导出 ====================

export default {
  // 认证相关
  login,
  register,
  logout,
  refreshToken,
  validateToken,

  // 用户信息
  getUserInfo,
  updateUserInfo,
  getUserByPhone,
  getUserByEmail,
  getUserByAccount,

  // 密码相关
  changePassword,
  sendResetPasswordEmail,
  resetPassword,

  // 验证码
  getCaptcha,

  // Token 管理
  saveToken,
  getToken,
  getRefreshToken,
  clearToken,

  // 用户信息本地存储
  saveUserInfo,
  getUserInfoFromStorage,
};
