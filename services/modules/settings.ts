import { request } from '../core/http';

// 定义具体的业务数据类型
export interface MusicTrack {
  name: string;
  author: string;
  url: string;
}

export interface SettingsPayload {
  apiKey: string;
  musicTracks: MusicTrack[];
}

// 导出 API 方法对象
export const settingsApi = {
  // 获取设置
  getSettings: () => request.get<SettingsPayload>('/settings'),

  // 保存设置
  saveSettings: (data: SettingsPayload) => request.post<null, SettingsPayload>('/settings', data),
};
