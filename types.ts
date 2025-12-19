export interface Article {
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
  posts: Article[];
  isLoading: boolean;
  addPost: (post: Article) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Article | undefined;
  incrementViews: (id: string) => Promise<void>;
}

export type Theme = 'cartoon' | 'chinese';

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
