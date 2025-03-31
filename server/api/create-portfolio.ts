import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "@/types/supabase";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const supabase = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "인증되지 않은 요청입니다.",
      });
    }

    // user_id 필드 추가
    const portfolioData = {
      ...body,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("portfolios")
      .insert(portfolioData)
      .select()
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `포트폴리오 생성 실패: ${error.message}`,
      });
    }

    setResponseStatus(event, 201);
    return {
      success: true,
      data,
      error: null,
    };
  } catch (err) {
    // H3Error 처리
    if (err instanceof Error && "statusCode" in err) {
      throw err;
    }

    // 기타 오류 처리
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : String(err),
    });
  }
});
