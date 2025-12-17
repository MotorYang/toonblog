import {
  GenerateContent,
  GenerateContentResponse,
  GenerateSummaryRequest,
  SummaryResponse,
} from '@/types/ai';
import http from '@/utils/request/http';

export const AiApi = {
  generateSummary: async (payload: GenerateSummaryRequest): Promise<SummaryResponse> =>
    await http.post(`/cartoon/ai/generate-summary`, payload),

  generateBlogContent: async (payload: GenerateContent): Promise<GenerateContentResponse> =>
    await http.post(`/cartoon/ai/generate-blog`, payload),
};
