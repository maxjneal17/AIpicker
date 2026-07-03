export interface Recommendation {
  tool: string;
  url: string;
  category: string;
  score: number;
  label: "Best pick" | "Alternative";
  why: string;
  tags: string[];
}

export interface RecommendationResult {
  query_summary: string;
  recommendations: Recommendation[];
  caveat: string | null;
}
