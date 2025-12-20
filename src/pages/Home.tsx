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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { ShareButton } from '@/components/Sharebutton';
import { SkeletonGrid } from '@/components/Skeleton';
import { ToonCard } from '@/components/ToonCard';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { KeyboardShortcutHint, useKeyboardShortcuts } from '@/hooks/Usekeyboardshortcuts';
import { useReadPosts } from '@/hooks/UseReadPosts';
import { formatDate } from '@/utils/common';

const PAGE_SIZE = 9;

export const Home: React.FC = () => {
  const { posts } = useBlogStore();
  const { t } = useLanguage();
  const { isRead, markAsRead } = useReadPosts();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State for filters, sorting, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(() => {
    // 从 localStorage 读取布局模式，默认为 'grid'
    const saved = localStorage.getItem('blogLayoutMode');
    return saved === 'grid' || saved === 'list' ? saved : 'grid';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Category configuration - same as CreatePost
  const categoryConfig = [
    { value: 'tech', emoji: '💻', color: 'bg-toon-blue' },
    { value: 'life', emoji: '🌱', color: 'bg-toon-yellow' },
    { value: 'trip', emoji: '🏍️', color: 'bg-toon-purple' },
    { value: 'food', emoji: '🍕', color: 'bg-toon-red' },
    { value: 'random', emoji: '🎲', color: 'bg-gray-400' },
  ];

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const uniqueCategories = new Set(posts.map((post) => post.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [posts]);

  // Get category config by value
  const getCategoryConfig = (value: string) => {
    return categoryConfig.find((cat) => cat.value === value);
  };

  // 1. Filter and Sort Logic (Get all matching results first)
  const allMatchingPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Filter by Search Query (Title, Excerpt, Tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, selectedCategory, searchQuery, sortOrder]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(allMatchingPosts.length / PAGE_SIZE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return allMatchingPosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [allMatchingPosts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Save layout mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('blogLayoutMode', layoutMode);
  }, [layoutMode]);

  // 键盘快捷键
  useKeyboardShortcuts([
    {
      key: '/',
      handler: () => searchInputRef.current?.focus(),
      description: '聚焦搜索框',
    },
    {
      key: 'Escape',
      handler: () => {
        setSearchQuery('');
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
      handler: () => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc')),
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
  }, [currentPage]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOrder('desc');
  };

  const toggleLayoutMode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLayoutMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
      setIsLoading(false);
    }, 300);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '';

  return (
    <div className="space-y-4 md:space-y-5 pb-8">
      {/* Hero Section - 更紧凑 */}
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

      {/* Filter & Control Bar - 紧凑布局 */}
      <section className="bg-gradient-to-br from-white to-gray-50 border-3 border-black rounded-xl p-3 md:p-4 shadow-toon-lg space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 搜索框 - 缩小尺寸 */}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.search')}
            className="w-full pl-10 pr-20 py-2 md:py-2.5 border-3 border-black rounded-lg font-bold text-sm md:text-base focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all text-gray-900 bg-white placeholder:text-gray-400"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {!searchQuery && (
              <kbd className="hidden md:inline-block px-2 py-0.5 bg-gray-100 border-2 border-gray-300 rounded text-xs font-black text-gray-500">
                /
              </kbd>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-toon-red transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* 分类标签和排序控制 - 优化移动端布局 */}
        <div className="border-t-2 border-dashed border-gray-300 pt-3 space-y-3 md:space-y-0">
          {/* 桌面端：单行布局 */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-2">
            {/* 左侧：分类标签 */}
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

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-3 py-1.5 font-black border-2 border-black rounded-lg transition-all text-xs md:text-sm
                        animate-in fade-in slide-in-from-bottom-2 duration-300
                        ${
                          selectedCategory === cat
                            ? `${isAll ? 'bg-toon-yellow' : config?.color || 'bg-toon-yellow'} text-gray-900 shadow-toon hover:shadow-toon-lg scale-105`
                            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-toon-sm hover:shadow-toon'
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isAll ? t('home.filter.all') : t(`category.${cat}`)}
                      {selectedCategory === cat && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 右侧：控制按钮 */}
            <div className="flex gap-1.5 flex-shrink-0">
              {/* 快捷键帮助按钮 */}
              <button
                onClick={() => setShowShortcuts(true)}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 border-2 border-black rounded-lg hover:bg-gray-200 transition-all shadow-toon-sm hover:shadow-toon flex items-center gap-1.5 font-bold text-xs"
                title="键盘快捷键 (?)"
              >
                <Keyboard size={16} />
                <span className="hidden lg:inline">快捷键</span>
              </button>

              {/* 布局切换按钮 */}
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

              {/* 排序按钮 */}
              <button
                onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="bg-toon-blue text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-cyan-400 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs"
                title="切换排序 (S)"
              >
                {sortOrder === 'desc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                <span className="hidden sm:inline">
                  {sortOrder === 'desc' ? t('home.filter.latest') : t('home.filter.oldest')}
                </span>
              </button>

              {/* 清除筛选按钮 */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-toon-red text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-red-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs animate-in fade-in scale-in duration-300"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">{t('home.clear_filters')}</span>
                </button>
              )}
            </div>
          </div>

          {/* 移动端：垂直布局 */}
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

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-3 py-1.5 font-black border-2 border-black rounded-lg transition-all text-xs
                        animate-in fade-in slide-in-from-bottom-2 duration-300
                        ${
                          selectedCategory === cat
                            ? `${isAll ? 'bg-toon-yellow' : config?.color || 'bg-toon-yellow'} text-gray-900 shadow-toon hover:shadow-toon-lg scale-105`
                            : 'bg-white hover:bg-gray-100 text-gray-900 shadow-toon-sm hover:shadow-toon'
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isAll ? t('home.filter.all') : t(`category.${cat}`)}
                      {selectedCategory === cat && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 控制按钮区域 */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* 快捷键帮助按钮 */}
              <button
                onClick={() => setShowShortcuts(true)}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 border-2 border-black rounded-lg hover:bg-gray-200 transition-all shadow-toon-sm hover:shadow-toon flex items-center gap-1.5 font-bold text-xs"
                title="键盘快捷键 (?)"
              >
                <Keyboard size={16} />
              </button>

              {/* 布局切换按钮 */}
              <button
                onClick={toggleLayoutMode}
                className="bg-toon-purple text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-purple-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs"
                title={layoutMode === 'grid' ? '切换到列表视图 (G)' : '切换到卡片视图 (G)'}
              >
                {layoutMode === 'grid' ? <List size={16} /> : <Grid3x3 size={16} />}
                <span>{layoutMode === 'grid' ? '卡片' : '列表'}</span>
              </button>

              {/* 排序按钮 */}
              <button
                onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="bg-toon-blue text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-cyan-400 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs"
                title="切换排序 (S)"
              >
                {sortOrder === 'desc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
                <span>{sortOrder === 'desc' ? '最新' : '最旧'}</span>
              </button>

              {/* 清除筛选按钮 */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-toon-red text-white px-3 py-1.5 border-2 border-black rounded-lg hover:bg-red-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-0.5 active:shadow-toon-sm flex items-center gap-1.5 font-bold text-xs animate-in fade-in scale-in duration-300"
                >
                  <X size={16} />
                  <span>{t('home.clear_filters')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 筛选结果提示 - 紧凑 */}
        {hasActiveFilters && (
          <div className="bg-toon-yellow/20 border-2 border-toon-yellow rounded-lg px-3 py-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles size={14} className="text-toon-yellow flex-shrink-0" />
            <span className="text-xs font-bold text-gray-900">
              {t('home.results_found').replace('{count}', String(allMatchingPosts.length))}
            </span>
          </div>
        )}
      </section>

      {/* Posts Grid/List - 支持两种布局模式 */}
      {isLoading ? (
        <SkeletonGrid count={PAGE_SIZE} mode={layoutMode} />
      ) : paginatedPosts.length > 0 ? (
        <>
          {layoutMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => {
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

                        {/* 图片容器 - 缩小高度 */}
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

                        {/* 标签行 - 紧凑间距 */}
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

                        {/* 标题 - 加大字体，加粗 */}
                        <h2
                          className={`text-xl md:text-2xl font-black mb-2 leading-tight group-hover:drop-shadow-[2px_2px_0px_rgba(255,217,61,0.8)] transition-all duration-300 ${postIsRead ? 'text-gray-500' : 'text-gray-900'}`}
                        >
                          {post.title}
                        </h2>

                        {/* 摘要 - 缩小间距 */}
                        <p
                          className={`font-medium mb-3 flex-grow line-clamp-2 text-xs md:text-sm leading-relaxed ${postIsRead ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {post.excerpt}
                        </p>

                        {/* 元信息 - 淡化样式 */}
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

                    {/* 分享按钮 - 悬浮在卡片外 */}
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
            /* 列表布局 */
            <div className="space-y-3">
              {paginatedPosts.map((post, index) => {
                const categoryConf = getCategoryConfig(post.category);
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
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                              {postIsRead && <div className="absolute inset-0 bg-black/20"></div>}
                              {/* 已读标记 */}
                              <div className="absolute top-1 right-1">
                                {postIsRead ? (
                                  <div
                                    className="bg-gray-400 text-white p-1 rounded-full border-2 border-black shadow-toon-sm"
                                    title="已读"
                                  >
                                    <CheckCircle2 size={14} />
                                  </div>
                                ) : (
                                  <div
                                    className="bg-toon-blue text-white p-1 rounded-full border-2 border-black shadow-toon-sm animate-pulse"
                                    title="未读"
                                  >
                                    <Circle size={14} fill="currentColor" />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 右侧内容 */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            {/* 标签行 */}
                            <div className="flex gap-1.5 mb-2 flex-wrap">
                              <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-2 py-0.5 rounded-md text-xs font-black border-2 border-black uppercase tracking-wider shadow-toon-sm flex items-center gap-1">
                                {categoryConf?.emoji && (
                                  <span className="text-xs">{categoryConf.emoji}</span>
                                )}
                                {t(`category.${post.category}`)}
                              </span>
                              {post.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-white text-gray-900 px-2 py-0.5 rounded-md text-xs font-bold border-2 border-black flex items-center gap-1 shadow-toon-sm"
                                >
                                  <Tag size={10} /> {tag}
                                </span>
                              ))}
                            </div>

                            {/* 标题 - 加大字体，加粗 */}
                            <h2
                              className={`text-xl md:text-2xl font-black mb-2 leading-tight group-hover:text-toon-blue transition-colors ${postIsRead ? 'text-gray-500' : 'text-gray-900'}`}
                            >
                              {post.title}
                            </h2>

                            {/* 摘要 */}
                            <p
                              className={`font-medium mb-3 line-clamp-2 text-sm md:text-base leading-relaxed flex-grow ${postIsRead ? 'text-gray-400' : 'text-gray-700'}`}
                            >
                              {post.excerpt}
                            </p>

                            {/* 元信息 - 淡化样式 */}
                            <div className="flex items-center gap-4 text-xs font-bold">
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <div className="w-5 h-5 bg-gray-300 rounded-full border-2 border-black flex items-center justify-center">
                                  <User size={12} className="text-gray-600" />
                                </div>
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <Calendar size={12} />
                                <span>{formatDate(post.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* 分享按钮 - 悬浮在右上角 */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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
          )}

          {/* Pagination Controls - 紧凑样式 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-3 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 md:p-2.5 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-0.5 active:shadow-toon-sm transition-all group"
              >
                <ChevronLeft size={20} strokeWidth={3} className="group-hover:animate-pulse" />
              </button>

              <div className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-br from-white to-gray-100 text-gray-900 border-3 border-black rounded-lg shadow-toon font-black text-sm md:text-base min-w-[100px] md:min-w-[120px] text-center">
                <span className="text-toon-blue">{currentPage}</span>
                <span className="text-gray-400 mx-1.5">/</span>
                <span className="text-gray-600">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 md:p-2.5 bg-white text-gray-900 border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-0.5 active:shadow-toon-sm transition-all group"
              >
                <ChevronRight size={20} strokeWidth={3} className="group-hover:animate-pulse" />
              </button>
            </div>
          )}
        </>
      ) : (
        // Empty State - 紧凑空状态
        <div className="text-center py-12 md:py-16 bg-gradient-to-br from-white to-gray-50 text-gray-900 border-3 border-black rounded-xl border-dashed shadow-toon-lg animate-in fade-in scale-in duration-500">
          <div className="inline-block mb-4 p-4 bg-gray-100 border-3 border-black rounded-full animate-bounce">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black mb-2">{t('home.no_results')}</h3>
          <p className="font-bold text-gray-600 mb-4 max-w-md mx-auto text-sm">
            {searchQuery
              ? t('home.no_results_search').replace('{query}', searchQuery)
              : t('home.no_results_desc')}
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-toon-blue text-white font-black border-3 border-black rounded-lg shadow-toon hover:shadow-toon-lg hover:bg-cyan-400 active:translate-y-0.5 active:shadow-toon-sm transition-all text-sm"
          >
            <X size={18} />
            {t('home.clear_filters')}
          </button>
        </div>
      )}

      {/* 键盘快捷键帮助 */}
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
