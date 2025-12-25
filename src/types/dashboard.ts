// 月度增长数据类型
interface MonthlyGrowth {
  month: string;
  count: number;
}

// 热门文章类型
interface HotArticle {
  id: string;
  title: string;
  views: number;
  category: string;
}

// 分类统计类型
type CategoryCounts = Record<string, number>;

export interface DashboardInfo {
  totalArticles: number;
  totalViews: number;
  categoryCounts: CategoryCounts;
  monthlyGrowth: MonthlyGrowth[];
  hotArticles: HotArticle[];
}
