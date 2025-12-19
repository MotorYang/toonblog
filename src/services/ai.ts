import { AiApi } from '@/api/ai';
import { Tip } from '@/components/GlobalTip';
import {
  ChatRequest,
  ChatResponse,
  GenerateContent,
  GenerateContentResponse,
  GenerateSummaryRequest,
  HealthCheckResponse,
  SummaryResponse,
} from '@/types/ai';

export const aiService = {
  // 生成摘要
  generateSummary: async (payload: GenerateSummaryRequest): Promise<SummaryResponse> =>
    await AiApi.generateSummary(payload),
  // 生成正文
  generateBlogContent: async (payload: GenerateContent): Promise<GenerateContentResponse> =>
    await AiApi.generateBlogContent(payload),
  // AI对话
  chat: async (payload: ChatRequest): Promise<ChatResponse> => await AiApi.chat(payload),
  // AI服务健康校验
  healthCheck: async () => {
    const aiStatus: HealthCheckResponse = await AiApi.healthCheck();
    if (aiStatus.status === 'ok') {
      return true;
    }
    Tip.error(aiStatus.rateLimit);
    return false;
  },
};
