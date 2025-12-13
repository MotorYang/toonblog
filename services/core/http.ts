import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { Tip } from '../../components/GlobalTip';

// 定义后端基础地址
const BASE_URL = '/api';

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 超时时间 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. 请求拦截器 (Request Interceptor) ---
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 例如：在这里统一添加 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- 2. 响应拦截器 (Response Interceptor) ---
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接解包：response.data 才是后端返回的 JSON
    const res = response.data;

    // 假设 code === 200 代表成功
    if (res.code === 200) {
      // 直接返回 data 字段，这样业务层拿到的就是纯数据，不需要再 res.data.data
      return res.data;
    }

    // 业务错误处理 (比如 code: 4001 代表参数错误)
    // 统一在这里弹窗，业务层就不用写 Tip.error 了
    Tip.error(res.message || '业务处理失败');

    // 抛出错误，中断 Promise 链，让业务层的 catch 捕获（如果需要停止 loading）
    return Promise.reject(new Error(res.message || 'Error'));
  },
  (error: AxiosError) => {
    // --- HTTP 状态码错误处理 (404, 500, 网络中断) ---
    let message = '';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          // 可以在这里执行登出逻辑，例如 window.location.href = '/login'
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求地址出错';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `连接错误 ${error.response.status}`;
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时';
    } else if (error.message.includes('Network Error')) {
      message = '网络连接异常';
    } else {
      message = '未知错误';
    }

    // 统一弹窗
    Tip.error(message);

    return Promise.reject(error);
  },
);

// 封装常用的 GET/POST/PUT/DELETE 方法，简化调用
export const request = {
  get: <T, P = Record<string, unknown>>(url: string, params?: P): Promise<T> =>
    http.get(url, { params }),
  post: <T, D = Record<string, unknown>>(url: string, data?: D): Promise<T> => http.post(url, data),
  put: <T, D = Record<string, unknown>>(url: string, data?: D): Promise<T> => http.put(url, data),
  del: <T, P = Record<string, unknown>>(url: string, params?: P): Promise<T> =>
    http.delete(url, { params }),
};

export default http;
