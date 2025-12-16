import { AxiosError } from 'axios';

export const mapHttpError = (error: AxiosError): string => {
  if (!error.response) return '网络异常';

  switch (error.response.status) {
    case 401:
      return '登录已过期';
    case 403:
      return '没有权限';
    case 404:
      return '接口不存在';
    case 500:
      return '服务器错误';
    default:
      return `请求错误 ${error.response.status}`;
  }
};
