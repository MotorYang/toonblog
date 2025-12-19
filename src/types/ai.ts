export interface GenerateSummaryRequest {
  content: string;
  lang: string;
}

export interface SummaryResponse {
  summary: string;
}

export interface GenerateContent {
  title: string;
  content: string;
  lang: string;
}

export interface GenerateContentResponse {
  content: string;
  title: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  rateLimit: string;
}
