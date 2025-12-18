import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { Article } from '@/types/article';

interface PostNavigationProps {
  previous: Article | null;
  next: Article | null;
}

export const PostNavigation: React.FC<PostNavigationProps> = ({ previous, next }) => {
  if (!previous && !next) return null;

  return (
    <div className="mt-8 pt-6 border-t-3 border-dashed border-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 上一篇 */}
        {previous ? (
          <Link to={`/post/${previous.id}`} className="group block">
            <div className="bg-gradient-to-br from-white to-gray-50 border-3 border-black rounded-xl p-4 shadow-toon hover:shadow-toon-lg transition-all hover:-translate-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-gray-500 mb-2">
                <ChevronLeft size={16} className="group-hover:animate-pulse" />
                上一篇
              </div>
              <h4 className="font-black text-base md:text-lg text-gray-900 line-clamp-2 group-hover:text-toon-blue transition-colors leading-tight">
                {previous.title}
              </h4>
              {previous.excerpt && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 font-medium">
                  {previous.excerpt}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 border-3 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">没有更早的文章了</span>
          </div>
        )}

        {/* 下一篇 */}
        {next ? (
          <Link to={`/post/${next.id}`} className="group block">
            <div className="bg-gradient-to-br from-white to-gray-50 border-3 border-black rounded-xl p-4 shadow-toon hover:shadow-toon-lg transition-all hover:-translate-y-1 text-right">
              <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-500 mb-2">
                下一篇
                <ChevronRight size={16} className="group-hover:animate-pulse" />
              </div>
              <h4 className="font-black text-base md:text-lg text-gray-900 line-clamp-2 group-hover:text-toon-blue transition-colors leading-tight">
                {next.title}
              </h4>
              {next.excerpt && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 font-medium">
                  {next.excerpt}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="bg-gray-100 border-3 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">没有更新的文章了</span>
          </div>
        )}
      </div>
    </div>
  );
};
