import { ApiVerifyResult, DelCategoryVerifyResult, SettingsPayload } from '@/types/settings';
import http from '@/utils/request/http';

// 导出 API 方法对象
export const settingsApi = {
  // 获取设置
  getSettings: (): Promise<SettingsPayload> => http.get('/blog/settings/info'),

  // 保存设置
  saveSettings: (data: SettingsPayload) =>
    http.put<null, SettingsPayload>('/blog/settings/publish', data),

  // 校验API Key
  verifyApiKey: (key: string) =>
    http.post<ApiVerifyResult>(`/blog/settings/api-verify`, {
      apiKey: key,
    }),

  // 删除文章分类前的校验
  deleteCategoryBefore: (key: string) =>
    http.get<DelCategoryVerifyResult>(`/blog/settings/delete-check/${key}`),
};
