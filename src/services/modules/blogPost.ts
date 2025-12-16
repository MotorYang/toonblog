import { request } from '@/utils/request/http.ts';

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

export const blogPostApi = {
  getBlogPosts: (postId: string): Promise<BlogPost> =>
    request.get('/api/blogPosts', { params: { id: postId } }),
  getBlogPostsByType: (type: string): Promise<BlogPost[]> =>
    request.get('/api/blogPostsByType', { params: { type: type } }),
};
