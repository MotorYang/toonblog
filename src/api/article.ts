import { Article, ArticleCreateDTO, ArticleFilter } from '@/types/article.ts';
import { PageResult, QueryRequest } from '@/types/query.ts';
import http from '@/utils/request/http';

/**
 * Article API
 */
export const articleApi = {
  /**
   * 分页查询文章
   * POST /articles/query
   */
  query: (query: QueryRequest<ArticleFilter>): Promise<PageResult<Article>> =>
    http.post('/cartoon/articles/query', query),

  /**
   * 获取所有文章
   * GET /articles/all
   */
  getAllArticles: (): Promise<Article[]> => http.get('/cartoon/articles/all'),

  /**
   * 根据ID获取文章
   * GET /articles/get/{id}
   */
  getArticleById: (id: string): Promise<Article> => http.get(`/cartoon/articles/get/${id}`),

  /**
   * 创建新文章
   * POST /articles/create
   */
  createArticle: (article: ArticleCreateDTO): Promise<Article> =>
    http.post('/cartoon/articles/create', article),

  /**
   * 更新文章
   * PUT /articles/update
   */
  updateArticle: (article: Article): Promise<Article> =>
    http.put('/cartoon/articles/update', article),

  /**
   * 删除文章
   * DELETE /articles/del/{id}
   */
  deleteArticle: (id: string): Promise<void> => http.delete(`/cartoon/articles/del/${id}`),

  /**
   * 增加文章浏览量
   * POST /articles/views/{id}
   */
  incrementViews: (id: string): Promise<number> => http.post(`/cartoon/articles/views/${id}`),

  /**
   * 按分类获取文章
   * GET /articles/category/{category}
   */
  getArticlesByCategory: (category: string): Promise<Article[]> =>
    http.get(`/cartoon/articles/category/${category}`),

  /**
   * 按作者获取文章
   * GET /articles/author/{author}
   */
  getArticlesByAuthor: (author: string): Promise<Article[]> =>
    http.get(`/cartoon/articles/author/${author}`),

  /**
   * 搜索文章
   * GET /articles/search?keyword={keyword}
   */
  searchArticles: (keyword: string): Promise<Article[]> =>
    http.get('/cartoon/articles/search', { params: { keyword } }),
};
