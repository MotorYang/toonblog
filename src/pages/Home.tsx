import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Grid3x3,
  Keyboard,
  List,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { ShareButton } from '@/components/Sharebutton';
import { SkeletonGrid } from '@/components/Skeleton';
import { ToonCard } from '@/components/ToonCard';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { KeyboardShortcutHint, useKeyboardShortcuts } from '@/hooks/Usekeyboardshortcuts';
import { useReadPosts } from '@/hooks/UseReadPosts';
import { formatDate } from '@/utils/common';

export const Home: React.FC = () => {
  // 使用后端分页的 BlogContext
  const {
    posts, // 当前页的文章
    pagination,
    filters,
    updatePage,
    updateFilters,
    resetFilters,
    isLoading,
  } = useBlogStore();

  const { t } = useLanguage();
  const { isRead, markAsRead } = useReadPosts();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Local UI state
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('blogLayoutMode');
    return saved === 'grid' || saved === 'list' ? saved : 'grid';
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [pageInput, setPageInput] = useState<string>('');

  // Category configuration
  const categoryConfig = [
    { value: 'tech', emoji: '💻', color: 'bg-toon-blue' },
    { value: 'life', emoji: '🌱', color: 'bg-toon-yellow' },
    { value: 'trip', emoji: '🏍️', color: 'bg-toon-purple' },
    { value: 'food', emoji: '🍕', color: 'bg-toon-red' },
    { value: 'random', emoji: '🎲', color: 'bg-gray-400' },
  ];

  // 固定的分类列表（如果后端不提供分类列表）
  const categories = ['all', 'tech', 'life', 'trip', 'food', 'random'];

  // Get category config by value
  const getCategoryConfig = (value: string) => {
    return categoryConfig.find((cat) => cat.value === value);
  };

  // Save layout mode to localStorage
  useEffect(() => {
    localStorage.setItem('blogLayoutMode', layoutMode);
  }, [layoutMode]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '/',
      handler: () => searchInputRef.current?.focus(),
      description: '聚焦搜索框',
    },
    {
      key: 'Escape',
      handler: () => {
        updateFilters({ title: '' });
        searchInputRef.current?.blur();
      },
      description: '清除搜索/取消聚焦',
    },
    {
      key: 'g',
      handler: () => setLayoutMode((prev) => (prev === 'grid' ? 'list' : 'grid')),
      description: '切换网格/列表视图',
    },
    {
      key: 's',
      handler: () => updateFilters({ sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' }),
      description: '切换排序方式',
    },
    {
      key: '?',
      handler: () => setShowShortcuts(true),
      description: '显示快捷键帮助',
    },
  ]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagination.currentPage]);

  const toggleLayoutMode = () => {
    setLayoutMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const cleanFilters = () => {
    setTitle('');
    resetFilters();
  };

  // 处理页码输入
  const handlePageInputChange = (value: string) => {
    // 只允许数字
    if (value === '' || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  // 跳转到指定页码
  const handlePageJump = () => {
    if (pageInput === '') return;

    const targetPage = parseInt(pageInput, 10);

    // 严格校验：必须是有效数字
    if (isNaN(targetPage) || targetPage < 1) {
      // 如果输入无效，重置输入框
      setPageInput('');
      return;
    }

    // 如果页码大于最大页码，跳转到最后一页
    const finalPage = targetPage > pagination.totalPages ? pagination.totalPages : targetPage;

    // 跳转到目标页
    updatePage(finalPage);
    setPageInput('');
  };

  // 处理回车键跳转
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageJump();
    } else if (e.key === 'Escape') {
      setPageInput('');
      e.currentTarget.blur();
    }
  };

  const hasActiveFilters =
    (filters.category && filters.category !== 'all') ||
    (filters.title && filters.title.trim() !== '');

  return (
    <div className="space-y-4 md:space-y-5 pb-8">
      {/* Hero Section */}
      <section className="relative text-center py-3 md:py-4 px-4">
        <div className="relative z-10">
          <h1
            className="text-2xl md:text-4xl font-black text-gray-900 mb-2 animate-in fade-in slide-in-from-top-6 duration-700"
            style={{ animationDelay: '100ms' }}
          >
            {t('home.welcome')}
          </h1>

          <div
            className="inline-block animate-in fade-in slide-in-from-top-8 duration-700"
            style={{ animationDelay: '200ms' }}
          >
            <p className="text-xs md:text-base font-bold bg-gradient-to-r from-toon-yellow to-yellow-300 border-3 border-black inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-toon transform -rotate-2 hover:rotate-0 transition-transform duration-300 text-gray-900">
              {t('home.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Control Bar */}
      <section className="bg-gradient-to-br from-white to-gray-50 border-3 border-black rounded-xl p-3 md:p-4 shadow-toon-lg space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              className="text-gray-400 group-focus-within:text-toon-blue transition-colors"
              size={18}
            />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters({ title });
              }
            }}
            placeholder={t('home.search')}
            className="w-full pl-10 pr-20 py-2 md:py-2.5 border-3 border-black rounded-lg font-bold text-sm md:text-base focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all text-gray-900 bg-white placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {title && (
              <kbd className="hidden md:inline-block px-2 py-0.5 bg-gray-100 border-2 border-gray-300 rounded text-xs font-black text-gray-500">
                /
              </kbd>
            )}
            {title && (
              <button
                onClick={() => {
                  setTitle('');
                  updateFilters({ title: '' });
                }}
                className="text-gray-400 hover:text-toon-red transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Categories and Controls */}
        <div className="border-t-2 border-dashed border-gray-300 pt-3 space-y-3 md:space-y-0">
          {/* Desktop Layout */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-2">
            {/* Categories */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Tag size={16} className="text-gray-600" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  {t('home.filter.category')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat, index) => {
                  const config = getCategoryConfig(cat);
                  const isAll = cat === 'all';
                  const isSelected = filters.category === cat || (isAll && filters.category === '');

                  return (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: cat })}
                      disabled={isLoading}
                      className={`
                        px-3 py-1.5 font-black border-2 border-black rounded-lg transition-all text-xs md:text-sm
                        animate-in fade-in slide-in-from-bottom-2 duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          isSelected
                            ? `${isAll ? 'bg-toon-yellow' : config?.color || 'bg-toon-yellow'} text-gray-900 shadow-toon hover:shadow-toon-lg scale-105`
                            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-toon-sm hover:shadow-toon'
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isAll ? t('home.filter.all') : t(`category.${cat}`)}
                      {isSelected && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowShortcuts(true)}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 border-2 border-black rounded-lg hover:bg-gray-200 transition-all shadow-toon-sm hover:shadow-toon flex items-center gap-1.5 font-bold text-xs"
                title="键盘快捷键 (?)"
              >
                <Keyboard size={16} />
                <span className="hidden lg:inline">快捷键</span>
              </button>

              <button
                onClick={toggleLayoutMode}
                className="bg-toon-purple text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-purple-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs"
                title={layoutMode === 'grid' ? '切换到列表视图 (G)' : '切换到卡片视图 (G)'}
              >
                {layoutMode === 'grid' ? <List size={16} /> : <Grid3x3 size={16} />}
                <span className="hidden sm:inline">
                  {layoutMode === 'grid' ? t('home.layout.list') : t('home.layout.grid')}
                </span>
              </button>

              <button
                onClick={() =>
                  updateFilters({ sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })
                }
                disabled={isLoading}
                className="bg-toon-blue text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-cyan-400 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                title="切换排序 (S)"
              >
                {filters.sortOrder === 'desc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                <span className="hidden sm:inline">
                  {filters.sortOrder === 'desc' ? t('home.filter.latest') : t('home.filter.oldest')}
                </span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={cleanFilters}
                  disabled={isLoading}
                  className="bg-toon-red text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-red-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs animate-in fade-in scale-in duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">{t('home.clear_filters')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* 分类标签区域 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Tag size={16} className="text-gray-600" />
                <span className="text-xs font-black text-gray-600 uppercase">
                  {t('home.filter.category')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat, index) => {
                  const config = getCategoryConfig(cat);
                  const isAll = cat === 'all';
                  const isSelected =
                    filters.category === cat || (isAll && filters.category === 'all');

                  return (
                    <button
                      key={cat}
                      onClick={() => updateFilters({ category: cat })}
                      disabled={isLoading}
                      className={`
                        px-3 py-1.5 font-black border-2 border-black rounded-lg transition-all text-xs
                        animate-in fade-in slide-in-from-bottom-2 duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          isSelected
                            ? `${isAll ? 'bg-toon-yellow' : config?.color || 'bg-toon-yellow'} text-gray-900 shadow-toon hover:shadow-toon-lg scale-105`
                            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-toon-sm hover:shadow-toon'
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isAll ? t('home.filter.all') : t(`category.${cat}`)}
                      {isSelected && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 控制按钮区域 */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setShowShortcuts(true)}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 border-2 border-black rounded-lg hover:bg-gray-200 transition-all shadow-toon-sm hover:shadow-toon flex items-center gap-1.5 font-bold text-xs"
              >
                <Keyboard size={16} />
              </button>

              <button
                onClick={toggleLayoutMode}
                className="bg-toon-purple text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-purple-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs"
              >
                {layoutMode === 'grid' ? <List size={16} /> : <Grid3x3 size={16} />}
                <span>{layoutMode === 'grid' ? '列表' : '卡片'}</span>
              </button>

              <button
                onClick={() =>
                  updateFilters({ sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })
                }
                disabled={isLoading}
                className="bg-toon-blue text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-cyan-400 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs disabled:opacity-50"
              >
                {filters.sortOrder === 'desc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                <span>{filters.sortOrder === 'desc' ? '最新' : '最旧'}</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={cleanFilters}
                  disabled={isLoading}
                  className="bg-toon-red text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-red-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs animate-in fade-in scale-in duration-300 disabled:opacity-50"
                >
                  <X size={16} />
                  <span>{t('home.clear_filters')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Results Info */}
        {hasActiveFilters && (
          <div className="bg-toon-yellow/20 border-2 border-toon-yellow rounded-lg px-3 py-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles size={14} className="text-toon-yellow flex-shrink-0" />
            <span className="text-xs font-bold text-gray-900">
              {t('home.results_found').replace('{count}', String(pagination.totalItems))}
            </span>
          </div>
        )}
      </section>

      {/* Posts Grid/List */}
      {isLoading ? (
        <SkeletonGrid count={pagination.pageSize} mode={layoutMode} />
      ) : posts.length > 0 ? (
        <>
          {layoutMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => {
                const categoryConf = getCategoryConfig(post.category);
                const postIsRead = isRead(post.id);

                return (
                  <div
                    key={post.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link to={`/post/${post.id}`} onClick={() => markAsRead(post.id)}>
                      <ToonCard
                        hoverEffect
                        color={index % 3 === 0 ? 'yellow' : index % 3 === 1 ? 'blue' : 'white'}
                        className="h-full flex flex-col group relative"
                      >
                        {/* 已读标记 */}
                        <div className="absolute top-3 right-3 z-10">
                          {postIsRead ? (
                            <div
                              className="bg-gray-400 text-white p-1.5 rounded-full border-2 border-black shadow-toon-sm"
                              title="已读"
                            >
                              <CheckCircle2 size={16} />
                            </div>
                          ) : (
                            <div
                              className="bg-toon-blue text-white p-1.5 rounded-full border-2 border-black shadow-toon-sm animate-pulse"
                              title="未读"
                            >
                              <Circle size={16} fill="currentColor" />
                            </div>
                          )}
                        </div>

                        {/* 图片容器 */}
                        {post.imageUrl && (
                          <div className="mb-3 border-3 border-black rounded-lg overflow-hidden h-40 md:h-44 bg-gray-200 relative">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            {postIsRead && <div className="absolute inset-0 bg-black/20"></div>}
                          </div>
                        )}

                        {/* 标签行 */}
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-2 py-0.5 rounded-md text-xs font-black border-2 border-black uppercase tracking-wider shadow-toon-sm flex items-center gap-1">
                            {categoryConf?.emoji && (
                              <span className="text-xs">{categoryConf.emoji}</span>
                            )}
                            {t(`category.${post.category}`)}
                          </span>
                          {post.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="bg-white text-gray-900 px-2 py-0.5 rounded-md text-xs font-bold border-2 border-black flex items-center gap-1 shadow-toon-sm hover:shadow-toon transition-shadow"
                            >
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>

                        {/* 标题 */}
                        <h2
                          className={`text-xl md:text-2xl font-black mb-2 leading-tight group-hover:drop-shadow-[2px_2px_0px_rgba(255,217,61,0.8)] transition-all duration-300 ${postIsRead ? 'text-gray-500' : 'text-gray-900'}`}
                        >
                          {post.title}
                        </h2>

                        {/* 摘要 */}
                        <p
                          className={`font-medium mb-3 flex-grow line-clamp-2 text-xs md:text-sm leading-relaxed ${postIsRead ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {post.excerpt}
                        </p>

                        {/* 元信息 */}
                        <div className="mt-auto flex items-center justify-between text-xs font-bold border-t-2 border-black pt-2.5">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <div className="w-5 h-5 bg-gray-300 rounded-full border-2 border-black flex items-center justify-center">
                              <User size={12} className="text-gray-600" />
                            </div>
                            <span className="text-xs">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar size={12} />
                            <span className="text-xs">{formatDate(post.date)}</span>
                          </div>
                        </div>
                      </ToonCard>
                    </Link>

                    {/* 分享按钮 */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <ShareButton
                        url={`/post/${post.id}`}
                        title={post.title}
                        description={post.excerpt}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 列表布局 - 简化版 */
            <div className="space-y-3">
              {posts.map((post, index) => {
                // const categoryConf = getCategoryConfig(post.category);
                const postIsRead = isRead(post.id);

                return (
                  <div
                    key={post.id}
                    className="block animate-in fade-in slide-in-from-left-4 duration-500 group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link to={`/post/${post.id}`} onClick={() => markAsRead(post.id)}>
                      <div className="bg-white border-3 border-black rounded-xl p-4 shadow-toon hover:shadow-toon-lg transition-all hover:-translate-y-1">
                        <div className="flex gap-4 items-center">
                          {/* 左侧图片 */}
                          {post.imageUrl && (
                            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 border-3 border-black rounded-lg overflow-hidden bg-gray-200 relative">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                              />
                              {postIsRead && <div className="absolute inset-0 bg-black/20"></div>}
                            </div>
                          )}

                          {/* 右侧内容 */}
                          <div className="flex-1 min-w-0">
                            <h2
                              className={`text-xl md:text-2xl font-black mb-2 leading-tight group-hover:text-toon-blue transition-colors ${postIsRead ? 'text-gray-500' : 'text-gray-900'}`}
                            >
                              {post.title}
                            </h2>
                            <p
                              className={`font-medium mb-2 line-clamp-2 text-sm ${postIsRead ? 'text-gray-400' : 'text-gray-700'}`}
                            >
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                              <span>{post.author}</span>
                              <span>{formatDate(post.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls - Enhanced with Page Jump */}
          {pagination.totalPages > 0 && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Desktop Layout */}
              <div className="hidden md:flex md:flex-row justify-center items-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={() => updatePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || isLoading}
                  className="p-2.5 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-0.5 active:shadow-toon-sm transition-all group"
                  aria-label="上一页"
                >
                  <ChevronLeft size={20} strokeWidth={3} className="group-hover:animate-pulse" />
                </button>

                {/* Current Page Display */}
                <div className="px-6 py-2.5 bg-gradient-to-br from-white to-gray-100 text-gray-900 border-3 border-black rounded-lg shadow-toon font-black text-base min-w-[120px] text-center">
                  <span className="text-toon-blue">{pagination.currentPage}</span>
                  <span className="text-gray-400 mx-1.5">/</span>
                  <span className="text-gray-600">{pagination.totalPages}</span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => updatePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || isLoading}
                  className="p-2.5 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-0.5 active:shadow-toon-sm transition-all group"
                  aria-label="下一页"
                >
                  <ChevronRight size={20} strokeWidth={3} className="group-hover:animate-pulse" />
                </button>

                {/* Page Jump Input - Only show if there are multiple pages */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-sm font-bold text-gray-600 whitespace-nowrap">
                      跳转到
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={pageInput}
                      onChange={(e) => handlePageInputChange(e.target.value)}
                      onKeyDown={handlePageInputKeyDown}
                      placeholder="页码"
                      disabled={isLoading}
                      className="w-20 px-3 py-2 border-3 border-black rounded-lg font-bold text-base text-center focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all text-gray-900 bg-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handlePageJump}
                      disabled={!pageInput || isLoading}
                      className="px-4 py-2 bg-toon-blue text-white font-black border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-toon-blue active:translate-y-0.5 active:shadow-toon-sm transition-all text-sm whitespace-nowrap"
                    >
                      Go
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="flex flex-col gap-3 md:hidden">
                {/* Navigation Buttons Row */}
                <div className="flex justify-center items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => updatePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || isLoading}
                    className="flex-1 max-w-[120px] py-3 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon active:shadow-toon-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-sm flex items-center justify-center gap-1"
                    aria-label="上一页"
                  >
                    <ChevronLeft size={18} strokeWidth={3} />
                    <span>上一页</span>
                  </button>

                  {/* Current Page Display */}
                  <div className="px-4 py-3 bg-gradient-to-br from-white to-gray-100 text-gray-900 border-3 border-black rounded-lg shadow-toon font-black text-base min-w-[100px] text-center">
                    <span className="text-toon-blue">{pagination.currentPage}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-600">{pagination.totalPages}</span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => updatePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || isLoading}
                    className="flex-1 max-w-[120px] py-3 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon active:shadow-toon-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-sm flex items-center justify-center gap-1"
                    aria-label="下一页"
                  >
                    <span>下一页</span>
                    <ChevronRight size={18} strokeWidth={3} />
                  </button>
                </div>

                {/* Page Jump Input - Only show if there are multiple pages */}
                {pagination.totalPages > 1 && (
                  <div className="bg-gradient-to-br from-white to-gray-50 border-3 border-black rounded-lg p-3 shadow-toon">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-600 whitespace-nowrap flex-shrink-0">
                        跳转到第
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pageInput}
                        onChange={(e) => handlePageInputChange(e.target.value)}
                        onKeyDown={handlePageInputKeyDown}
                        placeholder="页码"
                        disabled={isLoading}
                        className="flex-1 min-w-0 px-3 py-2.5 border-3 border-black rounded-lg font-bold text-base text-center focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all text-gray-900 bg-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm font-bold text-gray-600 whitespace-nowrap flex-shrink-0">
                        页
                      </span>
                      <button
                        onClick={handlePageJump}
                        disabled={!pageInput || isLoading}
                        className="px-5 py-2.5 bg-toon-blue text-white font-black border-3 border-black rounded-lg shadow-toon active:shadow-toon-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm whitespace-nowrap flex-shrink-0"
                      >
                        跳转
                      </button>
                    </div>
                    {pageInput && parseInt(pageInput, 10) > pagination.totalPages && (
                      <div className="mt-2 text-xs font-bold text-toon-red text-center animate-in fade-in duration-200">
                        将跳转到最后一页 ({pagination.totalPages})
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 text-gray-900 border-3 border-black rounded-xl border-dashed shadow-toon-lg animate-in fade-in scale-in duration-500">
          <div className="inline-block mb-4 p-4 bg-gray-100 border-3 border-black rounded-full animate-bounce">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black mb-2">{t('home.no_results')}</h3>
          <p className="font-bold text-gray-600 mb-4 max-w-md mx-auto text-sm">
            {filters.title
              ? t('home.no_results_search').replace('{query}', filters.title)
              : t('home.no_results_desc')}
          </p>
          <button
            onClick={cleanFilters}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-toon-blue text-white font-black border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-cyan-400 active:translate-y-0.5 active:shadow-toon-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={18} />
            {t('home.clear_filters')}
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutHint
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={[
          { key: '/', handler: () => {}, description: '聚焦搜索框' },
          { key: 'Escape', handler: () => {}, description: '清除搜索/取消聚焦' },
          { key: 'g', handler: () => {}, description: '切换网格/列表视图' },
          { key: 's', handler: () => {}, description: '切换排序方式' },
          { key: '?', handler: () => {}, description: '显示此帮助' },
        ]}
      />
    </div>
  );
};
