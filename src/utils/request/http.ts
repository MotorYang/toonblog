import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { Tip } from '@/components/GlobalTip';
import { translate } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore';
import { BusinessError, HttpClient, HttpResponse, SuccessResponse } from '@/types/http';
import { mapHttpError } from '@/utils/request/error.ts';

let navigateToLogin: (() => void) | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setNavigateFunction = (navigate: () => void) => {
  navigateToLogin = navigate;
};

function isSuccessResponse<T>(response: HttpResponse<T>): response is SuccessResponse<T> {
  return response.code === 200;
}

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = userAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;

    if (isSuccessResponse(res)) {
      return response;
    }
    Tip.error(res.msg);
    return Promise.reject(new BusinessError(res.code, res.msg, res.timestamp));
  },
  async (error: AxiosError<HttpResponse>) => {
    if (error.response?.status === 401) {
      // Token 过期处理
      Tip.error(translate('auth.token.expired'));
      await userAuthStore.getState().logout();
      if (navigateToLogin) {
        navigateToLogin();
      } else {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    const errorMsg = mapHttpError(error);
    Tip.error(errorMsg);
    return Promise.reject(error);
  },
);

function extractData<T>(response: AxiosResponse<HttpResponse<T>>): T {
  const res = response.data;

  if (isSuccessResponse(res)) {
    return res.data;
  }

  throw new BusinessError(res.code, res.msg, res.timestamp);
}

// 创建 HTTP 客户端
const http: HttpClient = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<HttpResponse<T>>(url, config);
    return extractData(response);
  },

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.post<HttpResponse<T>>(url, data, config);
    return extractData(response);
  },

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.put<HttpResponse<T>>(url, data, config);
    return extractData(response);
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<HttpResponse<T>>(url, config);
    return extractData(response);
  },

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.patch<HttpResponse<T>>(url, data, config);
    return extractData(response);
  },

  async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.request<HttpResponse<T>>(config);
    return extractData(response);
  },
};

export default http;
export { axiosInstance, isSuccessResponse };
