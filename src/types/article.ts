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

export interface BlogContextType {
  posts: Article[];
  isLoading: boolean;
  addPost: (post: Article) => Promise<void>;
  updatePost: (post: Article) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Article | undefined;
  incrementViews: (id: string) => Promise<void>;
}
