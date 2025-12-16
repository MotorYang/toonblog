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
