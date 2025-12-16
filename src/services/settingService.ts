import { settingsApi } from '@/api/settings.ts';
import { SettingsPayload } from '@/types/settings.ts';

export const settingService = {
  // 获取设置
  getSettings: async (): Promise<SettingsPayload> => await settingsApi.getSettings(),

  // 保存设置
  saveSettings: async (data: SettingsPayload) => await settingsApi.saveSettings(data),

  // 校验API Key
  verifyApiKey: async (key: string) => await settingsApi.verifyApiKey(key),

  // 删除文章分类前的校验
  deleteCategoryBefore: async (key: string) => await settingsApi.deleteCategoryBefore(key),
};
