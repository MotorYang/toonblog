import { AiApi } from '@/api/ai';
import { Tip } from '@/components/GlobalTip';
import { HealthCheckResponse } from '@/types/ai.ts';

export const healthCheck = async (): Promise<boolean> => {
  const aiStatus: HealthCheckResponse = await AiApi.healthCheck();
  if (aiStatus.status === 'ok') {
    return true;
  }
  Tip.error(aiStatus.rateLimit);
  return false;
};
