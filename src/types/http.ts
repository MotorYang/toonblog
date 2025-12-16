// src/types/http.ts
import { AxiosRequestConfig } from 'axios';

// 成功响应
export interface SuccessResponse<T> {
  code: 200;
  msg: string;
  data: T;
  timestamp: string;
}

// 错误响应
interface ErrorResponse {
  code: number;
  msg: string;
  data: null;
  timestamp: string;
}

export type HttpResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export type RequestData = unknown;

// HTTP 客户端接口
export interface HttpClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;

  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;

  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;

  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;

  request<T = unknown>(config: AxiosRequestConfig): Promise<T>;
}

// 业务错误类
export class BusinessError extends Error {
  code: number;
  timestamp: string;

  constructor(code: number, message: string, timestamp: string) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.timestamp = timestamp;
  }
}
