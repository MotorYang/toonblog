import { request } from '../core/http';

export interface ApiVerifyResult {
  status: boolean;
}

export interface MusicTrack {
  name: string;
  author: string;
  url: string;
}

export interface SettingsPayload {
  apiKey: string;
  musicTracks: MusicTrack[];
}

export interface ArticleCategory {
  id: string | null;
  code: string;
  name_zh: string;
  name_en: string;
  remark: string;
  count: number;
}

export interface DelCategoryVerifyResult {
  id: string;
  status: boolean;
}

// 导出 API 方法对象
export const settingsApi = {
  // 获取设置
  getSettings: () => request.get<SettingsPayload>('/settings'),

  // 保存设置
  saveSettings: (data: SettingsPayload) => request.post<null, SettingsPayload>('/settings', data),

  // 校验API Key
  verifyApiKey: (key: string) => request.get<ApiVerifyResult>(`/settings/api/verify/${key}`),

  // 删除文章分类前的校验
  deleteCategoryBefore: (key: string) =>
    request.get<DelCategoryVerifyResult>(`/settings/category/del_before_verify/${key}`),
};
