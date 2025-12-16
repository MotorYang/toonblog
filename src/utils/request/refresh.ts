import axios from 'axios';

import { clearToken, getRefreshToken, setAccessToken } from '../auth.ts';

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

export const refreshToken = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      queue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await axios.post('/auth/refresh', {
      refreshToken: getRefreshToken(),
    });

    const newToken = res.data.data.accessToken;
    setAccessToken(newToken);

    queue.forEach((cb) => cb(newToken));
    queue = [];

    return newToken;
  } catch (e) {
    clearToken();
    window.location.href = '/login';
    return Promise.reject(e);
  } finally {
    isRefreshing = false;
  }
};
