import { PaginationParams } from '@/types/query.ts';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  views: number;
  imageUrl?: string;
  tags?: string[];
}

export type ArticleCreateDTO = Omit<Article, 'id' | 'views'>;

export interface ArticleFilter {
  title?: string;
  category?: string;
  sortOrder?: string;
}

export interface BlogContextType {
  posts: Article[];
  isLoading: boolean;
  addPost: (post: Article) => Promise<void>;
  updatePost: (post: Article) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Article | undefined;
  incrementViews: (id: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  refreshOnePost: (id: string) => Promise<void>;

  // 分页和筛选
  pagination: PaginationParams;
  filters: ArticleFilter;
  updatePage: (page: number) => void;
  updatePageSize: (size: number) => void;
  updateFilters: (newFilters: Partial<ArticleFilter>) => void;
  resetFilters: () => void;
  refreshCurrentPage: () => Promise<void>;
}
