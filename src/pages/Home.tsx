import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ToonCard } from '@/components/ToonCard';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';

const PAGE_SIZE = 6;

export const Home: React.FC = () => {
  const { posts } = useBlogStore();
  const { t } = useLanguage();

  // State for filters, sorting, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const uniqueTags = new Set(posts.map((post) => post.category));
    return ['All', ...Array.from(uniqueTags)];
  }, [posts]);

  // 1. Filter and Sort Logic (Get all matching results first)
  const allMatchingPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Filter by Search Query (Title, Excerpt, Tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
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

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortOrder('desc');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '';

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Hero Section - 更紧凑的布局 */}
      <section className="relative text-center py-4 md:py-6 px-4">
        <div className="relative z-10">
          <h1
            className="text-3xl md:text-5xl font-black text-gray-900 mb-3 animate-in fade-in slide-in-from-top-6 duration-700"
            style={{ animationDelay: '100ms' }}
          >
            {t('home.welcome')}
          </h1>

          <div
            className="inline-block animate-in fade-in slide-in-from-top-8 duration-700"
            style={{ animationDelay: '200ms' }}
          >
            <p className="text-sm md:text-lg font-bold bg-gradient-to-r from-toon-yellow to-yellow-300 border-4 border-black inline-block px-4 py-2 md:px-5 md:py-2.5 rounded-2xl shadow-toon transform -rotate-2 hover:rotate-0 transition-transform duration-300 text-gray-900">
              {t('home.subtitle')}
            </p>
          </div>

          {/* 统计信息 */}
          <div
            className="flex justify-center gap-4 md:gap-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '300ms' }}
          >
            <div className="bg-white border-3 border-black rounded-xl px-3 py-1.5 shadow-toon-sm">
              <div className="text-xl md:text-2xl font-black text-toon-blue">{posts.length}</div>
              <div className="text-xs font-bold text-gray-600">{t('home.count.article')}</div>
            </div>
            <div className="bg-white border-3 border-black rounded-xl px-3 py-1.5 shadow-toon-sm">
              <div className="text-xl md:text-2xl font-black text-toon-red">
                {categories.length - 1}
              </div>
              <div className="text-xs font-bold text-gray-600">{t('home.count.category')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Control Bar - 重新设计更清晰的布局 */}
      <section className="bg-gradient-to-br from-white to-gray-50 border-4 border-black rounded-2xl p-4 md:p-6 shadow-toon-lg space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 搜索框 - 更突出 */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              className="text-gray-400 group-focus-within:text-toon-blue transition-colors"
              size={22}
            />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.search')}
            className="w-full pl-12 pr-12 py-3 md:py-4 border-3 border-black rounded-xl font-bold text-base md:text-lg focus:outline-none focus:border-toon-blue focus:shadow-toon-lg transition-all text-gray-900 bg-white placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-toon-red transition-colors"
            >
              <X size={22} />
            </button>
          )}
        </div>

        {/* 分类标签和排序控制 - 优化为单行布局 */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* 左侧：分类标签 */}
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Tag size={18} className="text-gray-600" />
                <span className="text-sm font-black text-gray-600 uppercase">
                  {t('home.filter.category')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, index) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-4 py-2 font-black border-3 border-black rounded-xl transition-all text-sm md:text-base
                      animate-in fade-in slide-in-from-bottom-2 duration-300
                      ${
                        selectedCategory === cat
                          ? 'bg-toon-yellow text-gray-900 shadow-toon hover:shadow-toon-lg scale-105'
                          : 'bg-white hover:bg-gray-100 text-gray-900 shadow-toon-sm hover:shadow-toon'
                      }
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {cat}
                    {selectedCategory === cat && (
                      <span className="ml-2 inline-block w-2 h-2 bg-gray-900 rounded-full animate-pulse"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧：排序和清除按钮 */}
            <div className="flex gap-2 flex-shrink-0">
              {/* 排序按钮 */}
              <button
                onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="bg-toon-blue text-white px-4 py-2.5 border-3 border-black rounded-xl hover:bg-cyan-400 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-1 active:shadow-toon-sm flex items-center gap-2 font-bold text-sm"
                title="切换排序"
              >
                {sortOrder === 'desc' ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
                <span className="hidden sm:inline">
                  {sortOrder === 'desc' ? t('home.filter.latest') : t('home.filter.oldest')}
                </span>
              </button>

              {/* 清除筛选按钮 */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-toon-red text-white px-4 py-2.5 border-3 border-black rounded-xl hover:bg-red-500 transition-all shadow-toon hover:shadow-toon-lg active:translate-y-1 active:shadow-toon-sm flex items-center gap-2 font-bold text-sm animate-in fade-in scale-in duration-300"
                >
                  <X size={18} />
                  <span className="hidden sm:inline">{t('home.clear_filters')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 筛选结果提示 */}
        {hasActiveFilters && (
          <div className="bg-toon-yellow/20 border-2 border-toon-yellow rounded-lg px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles size={16} className="text-toon-yellow flex-shrink-0" />
            <span className="text-sm font-bold text-gray-900">
              找到 <span className="text-toon-blue text-lg">{allMatchingPosts.length}</span> 个结果
            </span>
          </div>
        )}
      </section>

      {/* Posts Grid - 优化卡片显示 */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginatedPosts.map((post, index) => (
              <Link
                to={`/post/${post.id}`}
                key={post.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ToonCard
                  hoverEffect
                  color={index % 3 === 0 ? 'white' : index % 3 === 1 ? 'yellow' : 'blue'}
                  className="h-full flex flex-col group"
                >
                  {/* 图片容器 - 增强悬停效果 */}
                  {post.imageUrl && (
                    <div className="mb-4 border-3 border-black rounded-xl overflow-hidden h-48 md:h-56 bg-gray-200 relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                      />
                      {/* 悬停遮罩 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  )}

                  {/* 标签行 - 优化样式 */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-3 py-1 rounded-lg text-xs font-black border-2 border-black uppercase tracking-wider shadow-toon-sm">
                      {post.category}
                    </span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white text-gray-900 px-3 py-1 rounded-lg text-xs font-bold border-2 border-black flex items-center gap-1 shadow-toon-sm hover:shadow-toon transition-shadow"
                      >
                        <Tag size={12} /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* 标题 - 修复绿色背景下的可见性问题 */}
                  <h2 className="text-xl md:text-2xl font-black mb-3 leading-tight group-hover:drop-shadow-[2px_2px_0px_rgba(255,217,61,0.8)] transition-all duration-300">
                    {post.title}
                  </h2>

                  {/* 摘要 */}
                  <p className="font-medium mb-4 flex-grow line-clamp-3 text-sm md:text-base text-gray-700 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* 元信息 - 优化布局 */}
                  <div className="mt-auto flex items-center justify-between text-xs md:text-sm font-bold border-t-3 border-black pt-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-6 h-6 bg-toon-purple rounded-full border-2 border-black flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} /> {post.date}
                    </div>
                  </div>
                </ToonCard>
              </Link>
            ))}
          </div>

          {/* Pagination Controls - 优化样式 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 md:gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 md:p-4 bg-white text-gray-900 border-4 border-black rounded-xl shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-1 active:shadow-toon-sm transition-all group"
              >
                <ChevronLeft size={24} strokeWidth={3} className="group-hover:animate-pulse" />
              </button>

              <div className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-br from-white to-gray-100 text-gray-900 border-4 border-black rounded-xl shadow-toon font-black text-base md:text-lg min-w-[120px] md:min-w-[160px] text-center">
                <span className="text-toon-blue">{currentPage}</span>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-600">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 md:p-4 bg-white text-gray-900 border-4 border-black rounded-xl shadow-toon hover:shadow-toon-lg hover:bg-toon-yellow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-toon-sm disabled:hover:bg-white active:translate-y-1 active:shadow-toon-sm transition-all group"
              >
                <ChevronRight size={24} strokeWidth={3} className="group-hover:animate-pulse" />
              </button>
            </div>
          )}
        </>
      ) : (
        // Empty State - 优化空状态设计
        <div className="text-center py-16 md:py-24 bg-gradient-to-br from-white to-gray-50 text-gray-900 border-4 border-black rounded-2xl border-dashed shadow-toon-lg animate-in fade-in scale-in duration-500">
          <div className="inline-block mb-6 p-6 bg-gray-100 border-3 border-black rounded-full animate-bounce">
            <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black mb-3">{t('home.no_results')}</h3>
          <p className="font-bold text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery ? `找不到包含 "${searchQuery}" 的文章` : t('home.no_results_desc')}
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-6 py-3 bg-toon-blue text-white font-black border-3 border-black rounded-xl shadow-toon hover:shadow-toon-lg hover:bg-cyan-400 active:translate-y-1 active:shadow-toon-sm transition-all"
          >
            <X size={20} />
            {t('home.clear_filters')}
          </button>
        </div>
      )}
    </div>
  );
};
