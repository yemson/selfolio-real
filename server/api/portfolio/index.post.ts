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

    // 기존 is_featured가 true인 포트폴리오를 false로 업데이트
    if (body.is_featured) {
      const { error: updateError } = await supabase
        .from("portfolios")
        .update({ is_featured: false })
        .eq("user_id", user.id)
        .eq("is_featured", true);

      if (updateError) {
        throw createError({
          statusCode: 500,
          statusMessage: `기존 포트폴리오 업데이트 실패: ${updateError.message}`,
        });
      }
    }

    // 새로운 포트폴리오 삽입
    const portfolioData = {
      ...body,
    };

    const { error } = await supabase
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
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : String(err),
    });
  }
});
