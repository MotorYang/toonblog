import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
};

// 卡片骨架屏
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border-3 border-black rounded-xl p-4 shadow-toon">
      {/* 图片骨架 */}
      <Skeleton className="w-full h-40 md:h-44 mb-3 rounded-lg" />

      {/* 标签骨架 */}
      <div className="flex gap-1.5 mb-2">
        <Skeleton className="w-16 h-5 rounded-md" />
        <Skeleton className="w-20 h-5 rounded-md" />
      </div>

      {/* 标题骨架 */}
      <Skeleton className="w-full h-6 mb-2 rounded" />
      <Skeleton className="w-3/4 h-6 mb-3 rounded" />

      {/* 摘要骨架 */}
      <Skeleton className="w-full h-4 mb-1.5 rounded" />
      <Skeleton className="w-5/6 h-4 mb-3 rounded" />

      {/* 元信息骨架 */}
      <div className="flex items-center justify-between border-t-2 border-gray-200 pt-2.5">
        <Skeleton className="w-20 h-5 rounded" />
        <Skeleton className="w-24 h-5 rounded" />
      </div>
    </div>
  );
};

// 列表项骨架屏
export const ListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white border-3 border-black rounded-xl p-4 shadow-toon">
      <div className="flex gap-4">
        {/* 左侧图片骨架 */}
        <Skeleton className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-lg" />

        {/* 右侧内容骨架 */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* 标签骨架 */}
          <div className="flex gap-1.5 mb-2">
            <Skeleton className="w-16 h-5 rounded-md" />
            <Skeleton className="w-20 h-5 rounded-md" />
            <Skeleton className="w-18 h-5 rounded-md" />
          </div>

          {/* 标题骨架 */}
          <Skeleton className="w-full h-7 mb-2 rounded" />
          <Skeleton className="w-2/3 h-7 mb-3 rounded" />

          {/* 摘要骨架 */}
          <Skeleton className="w-full h-4 mb-1.5 rounded" />
          <Skeleton className="w-4/5 h-4 mb-auto rounded" />

          {/* 元信息骨架 */}
          <div className="flex items-center gap-4 mt-3">
            <Skeleton className="w-20 h-5 rounded" />
            <Skeleton className="w-24 h-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 骨架屏网格容器
export const SkeletonGrid: React.FC<{ count?: number; mode?: 'grid' | 'list' }> = ({
  count = 6,
  mode = 'grid',
}) => {
  return (
    <div className={mode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-in fade-in duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {mode === 'grid' ? <CardSkeleton /> : <ListItemSkeleton />}
        </div>
      ))}
    </div>
  );
};

// 添加shimmer动画到全局CSS
export const SkeletonStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `}</style>
);
