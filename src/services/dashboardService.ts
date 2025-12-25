import { dashboardApi } from '@/api/dashboard';
import { DashboardInfo } from '@/types/dashboard';

export const dashboardService = {
  info: async (): Promise<DashboardInfo> => await dashboardApi.info(),
};
