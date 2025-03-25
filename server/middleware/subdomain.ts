// server/middleware/subdomain.ts
import { defineEventHandler, getRequestHeaders } from "h3";

export default defineEventHandler((event) => {
  // 요청 헤더에서 호스트 정보 가져오기
  const headers = getRequestHeaders(event);
  const host = headers.host || "";

  let subdomain = "main"; // 기본값

  // 로컬호스트 확인
  const isLocalhost =
    host.includes("localhost") || host.match(/^\d+\.\d+\.\d+\.\d+/);

  if (isLocalhost) {
    // 로컬호스트 환경

    // 서브도메인.localhost 형식 확인 (예: blog.localhost:3000)
    const parts = host.split(".");
    if (
      parts.length > 1 &&
      parts[0] !== "localhost" &&
      !parts[0].match(/^\d+$/)
    ) {
      subdomain = parts[0];
    } else {
      // URL 쿼리 파라미터에서 서브도메인 확인
      const url = new URL(`http://${host}${event.node.req.url || ""}`);
      const querySubdomain = url.searchParams.get("subdomain");
      if (querySubdomain) {
        subdomain = querySubdomain;
      }
    }
  } else {
    // 실제 환경
    const parts = host.split(".");
    if (parts.length > 2) {
      // 서브도메인 있음 (예: blog.example.com)
      subdomain = parts[0];
    }
  }

  // 서브도메인 정보를 이벤트 컨텍스트에 저장
  event.context.subdomain = subdomain;
});
