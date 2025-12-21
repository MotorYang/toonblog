import { articleApi } from '@/api/article';
import { Article, ArticleFilter } from '@/types/article.ts';
import { PageResult, QueryRequest } from '@/types/query.ts';

export const articleService = {
  query: (page: number, size: number, filter: ArticleFilter): Promise<PageResult<Article>> => {
    const queryRequest: QueryRequest<ArticleFilter> = {
      page: page,
      size: size,
      filter: filter,
    };
    return articleApi.query(queryRequest);
  },

  addArticle: async (post: Article): Promise<Article> => {
    return await articleApi.createArticle(post);
  },

  updateArticle: async (post: Article): Promise<Article> => {
    return await articleApi.updateArticle(post);
  },

  deleteArticle: async (id: string): Promise<void> => {
    return await articleApi.deleteArticle(id);
  },

  incrementViews: async (id: string): Promise<number> => {
    return await articleApi.incrementViews(id);
  },

  getAllArticles: async (): Promise<Article[]> => {
    return await articleApi.getAllArticles();
  },

  getArticleById: (id: string): Promise<Article> => {
    return articleApi.getArticleById(id);
  },
};
