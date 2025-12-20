import { Eye, FileText, Flame, Lock, TrendingUp, Trophy } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToonCard } from '@/components/ToonCard';
import { useBlogStore } from '@/context/BlogContext';
import { useLanguage } from '@/context/LanguageContext';
import { userAuthStore } from '@/stores/userAuthStore.ts';

export const Dashboard: React.FC = () => {
  const { posts } = useBlogStore();
  const { isAdmin } = userAuthStore();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Protect route
  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => navigate('/'), 100);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, navigate]);

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);

    // Category Stats
    const categoryCounts: Record<string, number> = {};
    posts.forEach((post) => {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    // Monthly Growth (Posts per month)
    const monthlyGrowth: Record<string, number> = {};
    posts.forEach((post) => {
      const month = post.date.substring(0, 7); // YYYY-MM
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    // Sort months
    const sortedMonths = Object.keys(monthlyGrowth).sort();

    // Top 10 Posts
    const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);

    return { totalPosts, totalViews, categoryCounts, monthlyGrowth, sortedMonths, topPosts };
  }, [posts]);

  if (!isAdmin)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-in fade-in scale-in duration-500">
        <div className="bg-toon-red/20 p-8 border-4 border-black rounded-2xl shadow-toon-lg">
          <Lock size={64} className="text-toon-red mb-4 mx-auto animate-pulse" />
          <h2 className="text-3xl font-black mb-2 text-gray-900">访问受限！</h2>
          <p className="font-bold text-gray-600">仅管理员可访问此页面</p>
        </div>
      </div>
    );

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black border-yellow-600 shadow-toon'; // Gold
      case 1:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-black border-gray-500 shadow-toon-sm'; // Silver
      case 2:
        return 'bg-gradient-to-br from-orange-300 to-orange-400 text-black border-orange-600 shadow-toon-sm'; // Bronze
      default:
        return 'bg-white text-gray-600 border-gray-300';
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-toon-purple',
      'bg-toon-blue',
      'bg-toon-yellow',
      'bg-toon-red',
      'bg-gradient-to-r from-toon-purple to-toon-blue',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Header - 优化标题区域 */}
      <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-5xl font-black mb-2 text-gray-900">{t('dash.title')}</h1>
        <p className="text-sm md:text-base font-bold text-gray-600">{t('dash.subtitle')}</p>
      </div>

      {/* Top Stats Cards - 增强卡片设计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <ToonCard
            color="yellow"
            className="flex items-center justify-between group hover:shadow-toon-lg transition-all"
          >
            <div>
              <p className="font-black text-sm md:text-base opacity-60 mb-1">
                {t('dash.total_posts')}
              </p>
              <p className="text-4xl md:text-6xl font-black group-hover:scale-105 transition-transform inline-block">
                {stats.totalPosts}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">篇文章</p>
            </div>
            <div className="bg-white p-4 md:p-5 border-3 border-black rounded-2xl shadow-toon group-hover:rotate-12 transition-transform">
              <FileText size={32} className="md:w-10 md:h-10" />
            </div>
          </ToonCard>
        </div>

        <div
          className="animate-in fade-in slide-in-from-right-4 duration-500"
          style={{ animationDelay: '100ms' }}
        >
          <ToonCard
            color="blue"
            className="flex items-center justify-between group hover:shadow-toon-lg transition-all"
          >
            <div>
              <p className="font-black text-sm md:text-base opacity-60 mb-1">
                {t('dash.total_views')}
              </p>
              <p className="text-4xl md:text-6xl font-black group-hover:scale-105 transition-transform inline-block">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-gray-600 mt-1">总浏览量</p>
            </div>
            <div className="bg-white p-4 md:p-5 border-3 border-black rounded-2xl shadow-toon group-hover:rotate-12 transition-transform">
              <Eye size={32} className="md:w-10 md:h-10" />
            </div>
          </ToonCard>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Category Distribution - 优化图表 */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: '200ms' }}
        >
          <ToonCard className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-2 h-8 bg-toon-purple rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-black">{t('dash.by_category')}</h3>
            </div>
            <div className="space-y-4 flex-grow">
              {Object.entries(stats.categoryCounts).map(([cat, count], index) => (
                <div key={cat} className="space-y-2 group">
                  <div className="flex justify-between font-bold text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full border-2 border-black ${getCategoryColor(index)}`}
                      ></span>
                      {t('category.' + cat)}
                    </span>
                    <span className="bg-gray-100 border-2 border-black px-2 py-0.5 rounded-lg text-xs">
                      {count} 篇
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 border-3 border-black rounded-full h-8 overflow-hidden relative group-hover:shadow-toon-sm transition-shadow">
                    <div
                      className={`h-full ${getCategoryColor(index)} border-r-3 border-black transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${(count / stats.totalPosts) * 100}%` }}
                    >
                      <span className="text-xs font-black text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                        {Math.round((count / stats.totalPosts) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ToonCard>
        </div>

        {/* Monthly Growth - 优化图表 */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: '300ms' }}
        >
          <ToonCard className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="bg-toon-red p-2 border-2 border-black rounded-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-black">{t('dash.growth')}</h3>
            </div>
            <div className="flex items-end gap-2 md:gap-3 h-48 md:h-56 border-b-4 border-black pb-2 px-2 overflow-x-auto">
              {stats.sortedMonths.map((month, index) => {
                const count = stats.monthlyGrowth[month];
                const maxCount = Math.max(...Object.values(stats.monthlyGrowth));
                const heightPercentage = (count / maxCount) * 100;
                const displayDate = month.slice(2);

                return (
                  <div
                    key={month}
                    className="flex flex-col items-center gap-1 min-w-[3rem] flex-1 group animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="font-black text-xs bg-white border-2 border-black rounded-full w-7 h-7 flex items-center justify-center shadow-toon-sm">
                      {count}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-toon-red to-red-400 border-3 border-black rounded-t-xl transition-all hover:from-red-500 hover:to-red-300 group-hover:scale-105 shadow-toon-sm"
                      style={{ height: `${heightPercentage}%`, minHeight: '12px' }}
                    />
                    <span className="font-bold text-[10px] transform -rotate-45 origin-top-left mt-2 whitespace-nowrap text-gray-600">
                      {displayDate}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-center font-bold text-gray-500 text-sm mt-4">{t('dash.timeline')}</p>
          </ToonCard>
        </div>
      </div>

      {/* Top 10 Leaderboard - 增强排行榜 */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '400ms' }}
      >
        <ToonCard color="white" className="overflow-hidden">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-dashed border-gray-300">
            <div className="bg-gradient-to-br from-toon-yellow to-yellow-400 p-3 border-3 border-black rounded-xl shadow-toon">
              <Trophy className="text-black w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-black uppercase">{t('dash.leaderboard')}</h3>
              <p className="text-xs md:text-sm font-bold text-gray-600">热门文章排行 TOP 10</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[300px]">
              <thead>
                <tr className="border-b-4 border-black bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm md:text-base">
                  <th className="p-3 md:p-4 font-black w-16 md:w-20">{t('dash.rank')}</th>
                  <th className="p-3 md:p-4 font-black">{t('dash.table_title')}</th>
                  <th className="p-3 md:p-4 font-black w-32 text-center hidden sm:table-cell">
                    {t('create.category')}
                  </th>
                  <th className="p-3 md:p-4 font-black w-24 md:w-32 text-right hidden sm:table-cell">
                    {t('dash.table_views')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topPosts.map((post, index) => (
                  <tr
                    key={post.id}
                    className="border-b-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all group"
                  >
                    <td className="p-3 md:p-4">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black rounded-full border-3 text-sm md:text-base ${getRankStyle(index)} group-hover:scale-110 transition-transform`}
                      >
                        {index < 3 ? <Trophy className="w-4 h-4 md:w-5 md:h-5" /> : index + 1}
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <Link
                        to={`/post/${post.id}`}
                        className="font-bold text-base md:text-lg hover:text-toon-blue transition-colors block group-hover:translate-x-1 transition-transform"
                      >
                        {post.title}
                      </Link>
                      <div className="flex gap-2 sm:hidden mt-2">
                        <span className="text-xs bg-gray-100 border-2 border-black px-2 py-0.5 rounded-lg font-bold uppercase">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-600 font-bold flex items-center gap-1">
                          <Eye size={12} />
                          {post.views?.toLocaleString() || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4 text-center hidden sm:table-cell">
                      <span className="bg-gradient-to-r from-gray-100 to-white border-2 border-black px-3 py-1.5 rounded-lg text-xs font-black uppercase shadow-toon-sm">
                        {t('category.' + post.category)}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-right font-black hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        {index < 3 && (
                          <Flame className="w-5 h-5 text-toon-red fill-toon-red animate-pulse" />
                        )}
                        <span className="text-lg">{post.views?.toLocaleString() || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {stats.topPosts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-6 border-3 border-black rounded-full">
                          <Eye className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="font-black text-gray-500">{t('dash.no_views')}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ToonCard>
      </div>
    </div>
  );
};
