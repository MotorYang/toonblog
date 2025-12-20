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

export interface ArticleCreateDTO {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  tags: string[];
}

export interface BlogContextType {
  posts: Article[];
  isLoading: boolean;
  addPost: (post: Article) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Article | undefined;
  incrementViews: (id: string) => Promise<void>;
}
