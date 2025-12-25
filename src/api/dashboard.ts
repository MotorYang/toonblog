import { DashboardInfo } from '@/types/dashboard.ts';
import http from '@/utils/request/http';

export const dashboardApi = {
  info: async (): Promise<DashboardInfo> => await http.get('/blog/dashboard/info'),
};
