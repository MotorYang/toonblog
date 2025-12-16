import { Article } from '@/types/article.ts';
import http from '@/utils/request/http';

export const ArticleApi = {
  getBlogPosts: (postId: string): Promise<Article> =>
    http.get('/api/blogPosts', { params: { id: postId } }),

  getBlogPostsByType: (type: string): Promise<Article[]> =>
    http.get('/api/blogPostsByType', { params: { type: type } }),
};
