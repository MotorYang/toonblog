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
  access_token: string;
  access_refresh_token: string;
  user: User;
  role: string[];
}

export interface LoginForm {
  account: string;
  password: string;
}
