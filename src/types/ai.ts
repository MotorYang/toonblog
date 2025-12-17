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
