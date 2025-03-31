import type { Database } from "./supabase";

export interface SubdomainResponse {
  subdomain: string;
}
export interface MainPortfolioApiResponse {
  subdomain: string;
  profile: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id"> | null;
  portfolio: Database["public"]["Tables"]["portfolios"]["Row"] | null;
  error: string | null;
}
