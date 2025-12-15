import { LoginForm, UserLoginResponse } from '../../types/auth';
import { request } from '../core/http';

export const userApi = {
  login: async (loginForm: LoginForm): Promise<UserLoginResponse> =>
    await request.post(`/system/auth/login`, loginForm),
};
