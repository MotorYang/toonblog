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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Lock size={64} className="text-toon-red mb-4" />
        <h2 className="text-3xl font-black mb-2">Restricted Area!</h2>
        <p className="font-bold text-gray-500">Dashboards are for bosses only.</p>
      </div>
    );

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-400 text-black border-yellow-600'; // Gold
      case 1:
        return 'bg-gray-300 text-black border-gray-500'; // Silver
      case 2:
        return 'bg-orange-300 text-black border-orange-600'; // Bronze
      default:
        return 'bg-white text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-black flex items-center justify-center gap-3">
          {t('dash.title')}
        </h1>
        <p className="font-bold text-gray-600">{t('dash.subtitle')}</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ToonCard color="yellow" className="flex items-center justify-between">
          <div>
            <p className="font-black text-base md:text-lg opacity-60">{t('dash.total_posts')}</p>
            <p className="text-4xl md:text-5xl font-black">{stats.totalPosts}</p>
          </div>
          <div className="bg-white p-3 md:p-4 border-2 border-black rounded-full shadow-toon">
            <FileText size={24} className="md:w-8 md:h-8" />
          </div>
        </ToonCard>

        <ToonCard color="blue" className="flex items-center justify-between">
          <div>
            <p className="font-black text-base md:text-lg opacity-60">{t('dash.total_views')}</p>
            <p className="text-4xl md:text-5xl font-black">{stats.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 md:p-4 border-2 border-black rounded-full shadow-toon">
            <Eye size={24} className="md:w-8 md:h-8" />
          </div>
        </ToonCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Category Distribution Chart */}
        <ToonCard className="flex flex-col h-full">
          <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-2">
            {t('dash.by_category')}
          </h3>
          <div className="space-y-4 flex-grow">
            {Object.entries(stats.categoryCounts).map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>{cat}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black rounded-full h-6 overflow-hidden relative">
                  <div
                    className="h-full bg-toon-purple border-r-2 border-black"
                    style={{ width: `${(count / stats.totalPosts) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ToonCard>

        {/* Monthly Growth Chart */}
        <ToonCard className="flex flex-col h-full">
          <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-2">
            <TrendingUp /> {t('dash.growth')}
          </h3>
          <div className="flex items-end gap-3 h-40 md:h-48 border-b-4 border-black pb-2 px-2 overflow-x-auto">
            {stats.sortedMonths.map((month) => {
              const count = stats.monthlyGrowth[month];
              const maxCount = Math.max(...Object.values(stats.monthlyGrowth));
              const heightPercentage = (count / maxCount) * 100;
              // Convert YYYY-MM to YY-MM
              const displayDate = month.slice(2);

              return (
                <div key={month} className="flex flex-col items-center gap-1 min-w-[3rem] flex-1">
                  <span className="font-bold text-xs">{count}</span>
                  <div
                    className="w-full bg-toon-red border-2 border-black rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${heightPercentage}%`, minHeight: '10px' }}
                  />
                  <span className="font-bold text-[10px] transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                    {displayDate}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center font-bold text-gray-400 text-sm mt-6">{t('dash.timeline')}</p>
        </ToonCard>
      </div>

      {/* Top 10 Leaderboard */}
      <ToonCard color="white" className="overflow-hidden">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="bg-toon-yellow p-1.5 md:p-2 border-2 border-black rounded-lg">
            <Trophy className="text-black w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase">{t('dash.leaderboard')}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[300px]">
            <thead>
              <tr className="border-b-4 border-black bg-black text-white text-sm md:text-base">
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
                  className="border-b-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 md:p-4">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-black rounded-full border-2 text-xs md:text-sm ${getRankStyle(index)}`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-3 md:p-4">
                    <Link
                      to={`/post/${post.id}`}
                      className="font-bold text-base md:text-lg hover:underline decoration-2 decoration-toon-blue block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex gap-2 sm:hidden mt-1">
                      <span className="text-xs bg-gray-100 border border-black px-1 rounded font-bold uppercase">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">{post.views} views</span>
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-center hidden sm:table-cell">
                    <span className="bg-gray-100 border-2 border-black px-2 py-1 rounded-md text-xs font-bold uppercase">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 text-right font-black hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-2">
                      {index < 3 && <Flame className="w-4 h-4 text-toon-red fill-toon-red" />}
                      {post.views?.toLocaleString() || 0}
                    </div>
                  </td>
                </tr>
              ))}
              {stats.topPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-bold text-gray-400">
                    {t('dash.no_views')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ToonCard>
    </div>
  );
};
