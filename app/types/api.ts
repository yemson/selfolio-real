// /types/api.ts
import type { Database } from './supabase'

// 서브도메인 API 응답 타입
export interface SubdomainResponse {
  subdomain: string;
}

// 포트폴리오 API 응답 타입
export interface PortfolioApiResponse {
  subdomain: string;
  profile: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id"> | null;
  portfolio: Database["public"]["Tables"]["portfolios"]["Row"] | null;
  error: string | null;
}