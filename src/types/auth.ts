export interface User {
  id: string;
  account: string;
  name: string;
  phone: string;
  gender: string;
  city: string;
  email: string;
}

export interface UserLoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  roles: string[];
}

export interface LoginForm {
  account: string;
  password: string;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}
