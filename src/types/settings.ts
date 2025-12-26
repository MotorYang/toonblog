export interface ApiVerifyResult {
  status: boolean;
  message: string;
}

export interface MusicTrack {
  id: string | null;
  name: string;
  author: string;
  url: string;
  duration: number;
  sortOrder: number;
}

export interface ArticleCategory {
  id: string | null;
  code: string;
  nameZh: string;
  nameEn: string;
  remark: string;
  count: number;
  sortOrder: number;
}

export interface SettingsPayload {
  apiKey: string;
  musicTracks: MusicTrack[];
  categories: ArticleCategory[];
}

export interface DelCategoryVerifyResult {
  id: string;
  status: boolean;
  articleCount: number;
  message: string;
}
