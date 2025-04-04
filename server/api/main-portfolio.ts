// /server/api/portfolio.ts
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "@/types/supabase";
import type { MainPortfolioApiResponse } from "@/types/api";
import { getSubdomain } from "../utils/subdomain";

export default defineEventHandler(async (event) => {
  // 서브도메인 정보 가져오기
  const subdomain = getSubdomain(event);

  // 기본 응답 구조
  const response: MainPortfolioApiResponse = {
    subdomain,
    profile: null,
    portfolio: null,
    error: null,
  };

  try {
    // 메인 서브도메인이면 추가 데이터 필요 없음
    if (subdomain === "main") {
      return response;
    }

    const supabase = await serverSupabaseClient<Database>(event);

    // 프로필 데이터 가져오기
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", subdomain)
      .single();

    if (profileError) {
      response.error = `프로필을 찾을 수 없습니다: ${profileError.message}`;
      return response;
    }

    response.profile = profile;

    // 포트폴리오 데이터 가져오기
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 포트폴리오 데이터가 없어도 에러로 처리하지 않음 (존재하지 않을 수 있음)
    if (!portfolioError) {
      response.portfolio = portfolio;
    }

    return response;
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : String(err),
    });
  }
});
