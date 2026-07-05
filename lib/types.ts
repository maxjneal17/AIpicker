export interface Recommendation {
  tool: string;
  url: string;
  category: string;
  score: number;
  label: "Best pick" | "Alternative";
  why: string;
  tags: string[];
}

export interface Stage {
  name: string;
  description: string;
  handoff: string | null;
  recommendations: Recommendation[];
}

export interface RecommendationResult {
  query_summary: string;
  mode: "single" | "workflow";
  overview: string | null;
  stages: Stage[];
  caveat: string | null;
}
