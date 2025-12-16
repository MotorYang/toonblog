import { ApiVerifyResult, DelCategoryVerifyResult, SettingsPayload } from '@/types/settings';
import http from '@/utils/request/http';

// 导出 API 方法对象
export const settingsApi = {
  // 获取设置
  getSettings: (): Promise<SettingsPayload> => http.get('/settings'),

  // 保存设置
  saveSettings: (data: SettingsPayload) => http.post<null, SettingsPayload>('/settings', data),

  // 校验API Key
  verifyApiKey: (key: string) => http.get<ApiVerifyResult>(`/settings/api/verify/${key}`),

  // 删除文章分类前的校验
  deleteCategoryBefore: (key: string) =>
    http.get<DelCategoryVerifyResult>(`/settings/category/del_before_verify/${key}`),
};
