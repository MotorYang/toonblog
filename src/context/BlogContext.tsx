import React, { createContext, useContext, useEffect, useState } from 'react';

import { articleService } from '@/services/article';
import { Article, ArticleFilter, BlogContextType } from '@/types/article';
import { PaginationParams } from '@/types/query';

// 扩展的 Context 类型
interface ExtendedBlogContextType extends BlogContextType {
  // 分页状态
  pagination: PaginationParams;

  // 筛选参数
  filters: ArticleFilter;

  // 便捷方法
  updatePage: (page: number) => void;
  updatePageSize: (size: number) => void;
  updateFilters: (newFilters: Partial<ArticleFilter>) => void;
  resetFilters: () => void;

  // 刷新当前页数据
  refreshCurrentPage: () => Promise<void>;
}

const BlogContext = createContext<ExtendedBlogContextType | undefined>(undefined);

// 默认分页参数
const DEFAULT_PAGINATION: PaginationParams = {
  currentPage: 1,
  pageSize: 9,
  totalPages: 0,
  totalItems: 0,
};

// 默认筛选参数
const DEFAULT_FILTERS: ArticleFilter = {
  category: '',
  title: '',
  sortOrder: 'desc',
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationParams>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<ArticleFilter>(DEFAULT_FILTERS);

  // 从后端获取当前页数据
  const fetchCurrentPage = async (
    page: number = pagination.currentPage,
    pageSize: number = pagination.pageSize,
    currentFilters: ArticleFilter = filters,
  ) => {
    setIsLoading(true);
    try {
      // 构建查询参数
      const queryParams: ArticleFilter = {};

      if (currentFilters.category && currentFilters.category !== 'all') {
        queryParams.category = currentFilters.category;
      }
      if (currentFilters.title?.trim()) {
        queryParams.title = currentFilters.title;
      }
      if (currentFilters.sortOrder?.trim()) {
        queryParams.sortOrder = currentFilters.sortOrder;
      }

      // 调用后端分页查询 API
      const queryResult = await articleService.query(page, pageSize, queryParams);

      // 更新文章列表（只包含当前页的数据）
      setPosts(queryResult.records);

      // 更新分页信息
      setPagination({
        currentPage: page,
        pageSize: pageSize,
        totalItems: queryResult.total,
        totalPages: Math.ceil(queryResult.total / pageSize),
      });
    } catch (error) {
      console.error('Failed to fetch posts', error);
      // 出错时清空列表
      setPosts([]);
      setPagination({
        currentPage: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchCurrentPage(1, DEFAULT_PAGINATION.pageSize, DEFAULT_FILTERS);
  }, []);

  // 更新页码
  const updatePage = async (page: number) => {
    const validPage = Math.max(1, Math.min(page, pagination.totalPages || 1));
    if (validPage !== pagination.currentPage) {
      await fetchCurrentPage(validPage, pagination.pageSize, filters);
    }
  };

  // 更新每页大小
  const updatePageSize = async (size: number) => {
    // 重置到第一页
    await fetchCurrentPage(1, size, filters);
  };

  // 更新筛选条件
  const updateFilters = async (newFilters: Partial<ArticleFilter>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };
    setFilters(updatedFilters);

    // 筛选条件变化时重置到第一页并重新请求数据
    await fetchCurrentPage(1, pagination.pageSize, updatedFilters);
  };

  // 重置筛选条件
  const resetFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    await fetchCurrentPage(1, pagination.pageSize, DEFAULT_FILTERS);
  };

  // 刷新当前页
  const refreshCurrentPage = async () => {
    await fetchCurrentPage(pagination.currentPage, pagination.pageSize, filters);
  };

  // 添加文章
  const addPost = async (post: Article) => {
    try {
      await articleService.addArticle(post);
      // 添加成功后刷新当前页
      await refreshCurrentPage();
    } catch (error) {
      console.error('Failed to create post', error);
      throw error;
    }
  };

  // 更新文章
  const updatePost = async (post: Article) => {
    try {
      await articleService.updateArticle(post);
      // 更新成功后刷新当前页
      await refreshCurrentPage();
    } catch (error) {
      console.error('Failed to update post', error);
      throw error;
    }
  };

  // 删除文章
  const deletePost = async (id: string) => {
    try {
      await articleService.deleteArticle(id);
      // 删除成功后刷新当前页
      await refreshCurrentPage();
    } catch (error) {
      console.error('Failed to delete post', error);
      throw error;
    }
  };

  // 获取单篇文章（从当前页的数据中查找）
  const getPost = (id: string) => {
    return posts.find((p) => p.id === id);
  };

  // 增加浏览量
  const incrementViews = async (id: string) => {
    try {
      const newViewCount = await articleService.incrementViews(id);
      // 只更新当前页数据中的文章
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, views: newViewCount } : post)),
      );
    } catch (error) {
      console.error('Failed to increment views', error);
    }
  };

  // 刷新所有文章（实际上是刷新当前页）
  const refreshPosts = async () => {
    await refreshCurrentPage();
  };

  // 刷新单篇文章
  const refreshOnePost = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await articleService.getArticleById(id);
      setPosts((prev) => prev.map((post) => (post.id === id ? { ...data } : post)));
    } catch (error) {
      console.error('Failed to fetch post', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        isLoading,
        addPost,
        updatePost,
        deletePost,
        getPost,
        incrementViews,
        refreshPosts,
        refreshOnePost,
        pagination,
        filters,
        updatePage,
        updatePageSize,
        updateFilters,
        resetFilters,
        refreshCurrentPage,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogStore = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogStore must be used within a BlogProvider');
  }
  return context;
};
