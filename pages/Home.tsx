import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Tag,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ToonCard } from '../components/ToonCard';
import { useBlogStore } from '../context/BlogContext';
import { useLanguage } from '../context/LanguageContext';

const PAGE_SIZE = 6;

export const Home: React.FC = () => {
  const { posts } = useBlogStore();
  const { t } = useLanguage();

  // State for filters, sorting, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchDate, setSearchDate] = useState<string>('');
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

    // Filter by Date
    if (searchDate) {
      result = result.filter((post) => post.date === searchDate);
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
  }, [posts, selectedCategory, searchDate, searchQuery, sortOrder]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(allMatchingPosts.length / PAGE_SIZE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return allMatchingPosts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [allMatchingPosts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchDate, searchQuery]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchDate('');
    setSearchQuery('');
    setSortOrder('desc');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchDate !== '' || searchQuery !== '';

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <section className="text-center py-4 md:py-8">
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-4 drop-shadow-[4px_4px_0_var(--color-bg-card)]">
          {t('home.welcome')}
        </h1>
        <p className="text-base md:text-xl font-bold bg-white border-2 border-black inline-block px-3 py-1 md:px-4 md:py-2 rounded-lg shadow-toon-hover transform -rotate-2 text-gray-900">
          {t('home.subtitle')}
        </p>
      </section>

      {/* Filter & Control Bar */}
      <section className="bg-white border-4 border-black rounded-xl p-3 md:p-4 shadow-toon space-y-4">
        {/* Top Row: Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.search')}
            className="w-full pl-10 pr-4 py-2 md:py-3 border-2 border-black rounded-lg font-bold text-base md:text-lg focus:outline-none focus:bg-toon-bg focus:shadow-toon-hover transition-all text-gray-900 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t-2 border-dashed border-gray-200 pt-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1 font-bold border-2 border-black rounded-lg transition-all text-xs md:text-sm
                  ${
                    selectedCategory === cat
                      ? 'bg-toon-yellow text-toon-ink shadow-toon-hover -translate-y-1'
                      : 'bg-gray-100 hover:bg-white text-gray-900'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Date & Sort Controls */}
          <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
            <div className="relative flex-grow md:flex-grow-0 max-w-[160px]">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full border-2 border-black rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:bg-toon-bg text-sm h-full bg-white text-gray-900"
              />
            </div>

            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="bg-toon-blue text-toon-ink p-1.5 md:p-2 border-2 border-black rounded-lg hover:bg-blue-400 transition-colors shadow-[2px_2px_0px_0px_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex-shrink-0"
              title="Toggle Sort Order"
            >
              {sortOrder === 'desc' ? <ArrowDownAZ size={20} /> : <ArrowUpAZ size={20} />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-toon-red text-white p-1.5 md:p-2 border-2 border-black rounded-lg hover:bg-red-500 transition-colors shadow-[2px_2px_0px_0px_var(--color-border)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex-shrink-0"
                title={t('home.clear_filters')}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginatedPosts.map((post, index) => (
              <Link to={`/post/${post.id}`} key={post.id}>
                <ToonCard
                  hoverEffect
                  color={index % 3 === 0 ? 'white' : index % 3 === 1 ? 'yellow' : 'blue'}
                  className="h-full flex flex-col"
                >
                  {post.imageUrl && (
                    <div className="mb-4 border-2 border-black rounded-lg overflow-hidden h-40 md:h-48 bg-gray-200 relative group">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="bg-black text-white px-2 py-0.5 rounded text-xs font-bold border-black border uppercase">
                      {post.category}
                    </span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white text-gray-900 px-2 py-0.5 rounded text-xs font-bold border-2 border-black flex items-center gap-1"
                      >
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl md:text-2xl font-black mb-2 leading-tight group-hover:underline decoration-2 underline-offset-2">
                    {post.title}
                  </h2>
                  <p className="font-medium mb-4 flex-grow line-clamp-3 text-sm md:text-base opacity-90">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs md:text-sm font-bold border-t-2 border-black pt-4">
                    <div className="flex items-center gap-2">
                      <User size={14} /> {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {post.date}
                    </div>
                  </div>
                </ToonCard>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 md:p-3 bg-white text-gray-900 border-4 border-black rounded-xl shadow-toon hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>

              <div className="px-4 md:px-6 py-2 md:py-3 bg-white text-gray-900 border-4 border-black rounded-xl shadow-toon font-black text-base md:text-lg min-w-[100px] md:min-w-[140px] text-center">
                {t('home.page_info', { current: currentPage, total: totalPages })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 md:p-3 bg-white text-gray-900 border-4 border-black rounded-xl shadow-toon hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white text-gray-900 border-4 border-black rounded-xl border-dashed">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-black mb-2">{t('home.no_results')}</h3>
          <p className="font-bold text-gray-500">
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}"`
              : t('home.no_results_desc')}
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-toon-blue font-black underline hover:text-blue-600"
          >
            {t('home.clear_filters')}
          </button>
        </div>
      )}
    </div>
  );
};
