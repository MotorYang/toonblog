export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  tags: string[];
  views: number;
}

export interface BlogContextType {
  posts: BlogPost[];
  isLoading: boolean;
  addPost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => BlogPost | undefined;
  incrementViews: (id: string) => Promise<void>;
}

export interface AuthContextType {
  user: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export type Theme = 'cartoon' | 'cyberpunk' | 'chinese';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type Language = 'en' | 'zh';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
