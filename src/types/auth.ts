export interface User {
  userId: string;
  username: string;
  nickName: string;
  avatar: string;
  roles: string[];
}

export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: User;
}

export interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  captchaId: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface CaptchaResponse {
  captchaId: string;
  image: string;
}
