// server/api/subdomain.ts
import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  // 미들웨어에서 저장한 서브도메인 가져오기
  return {
    subdomain: event.context.subdomain || "main",
  };
});
