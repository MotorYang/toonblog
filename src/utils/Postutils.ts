import { Article } from '@/types/article';

/**
 * 计算文章预估阅读时间
 * @param content 文章内容
 * @param wordsPerMinute 每分钟阅读字数（中文约200-300）
 * @returns 预估阅读分钟数
 */
export const calculateReadingTime = (content: string, wordsPerMinute: number = 250): number => {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 保留链接文字
    .replace(/[#*_~`]/g, '') // 移除 Markdown 标记
    .trim();

  const wordCount = plainText.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes); // 至少1分钟
};

/**
 * 获取上一篇和下一篇文章
 * @param currentPost 当前文章
 * @param allPosts 所有文章列表
 * @returns 上一篇和下一篇文章
 */
export const getAdjacentPosts = (
  currentPost: Article,
  allPosts: Article[],
): { previous: Article | null; next: Article | null } => {
  // 按日期排序
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const currentIndex = sortedPosts.findIndex((post) => post.id === currentPost.id);

  return {
    previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
    next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null,
  };
};

/**
 * 格式化阅读时间显示
 * @param minutes 分钟数
 * @returns 格式化的字符串
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return '不到 1 分钟';
  if (minutes === 1) return '1 分钟';
  return `约 ${minutes} 分钟`;
};
