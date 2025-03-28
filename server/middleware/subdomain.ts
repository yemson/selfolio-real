// server/middleware/subdomain.ts
import { defineEventHandler, getRequestHeaders, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  // 요청 헤더에서 호스트 정보 가져오기
  const headers = getRequestHeaders(event);
  const host = headers.host || "";
  const url = event.node.req.url || "";

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
      const reqUrl = new URL(`http://${host}${url}`);
      const querySubdomain = reqUrl.searchParams.get("subdomain");
      if (querySubdomain) {
        subdomain = querySubdomain;
      }
    }
  } else {
    // 실제 환경
    const parts = host.split(".");

    // www 도메인 처리
    if (parts[0] === "www") {
      // www는 메인 도메인으로 취급
      subdomain = "main";
    } else if (parts.length > 2) {
      // 서브도메인 있음 (예: blog.example.com)
      subdomain = parts[0];
    }
  }

  // 서브도메인 정보를 이벤트 컨텍스트에 저장
  event.context.subdomain = subdomain;

  // 서브도메인이 'main'이 아니고 존재하는 경우에만 라우트 제한 적용
  if (subdomain !== "main") {
    // 허용된 경로 목록
    const allowedPaths = ["/", "/api/portfolio"];

    // 메인 도메인으로 리다이렉트하기 위한 특별 경로 목록
    const mainDomainRedirectPaths = ["/login"];

    // 경로 추출 (쿼리 파라미터 제외)
    const path = url.split("?")[0];

    // 메인 도메인으로 리다이렉트해야 하는 경로인 경우
    if (mainDomainRedirectPaths.includes(path)) {
      // 메인 도메인 구성
      let mainDomain;
      if (isLocalhost) {
        mainDomain = "localhost:3000"; // 로컬호스트 환경
      } else {
        // 실제 환경에서 메인 도메인 추출 (예: example.com)
        mainDomain = host.split(".").slice(-2).join(".");
      }

      const protocol = event.node.req.headers["x-forwarded-proto"] || "http";
      const redirectUrl = `${protocol}://${mainDomain}${path}`;

      await sendRedirect(event, redirectUrl, 302);
      return;
    }

    // 허용되지 않은 경로로 접근하는 경우 루트 경로로 리다이렉트
    if (
      !allowedPaths.some(
        (allowedPath) =>
          path === allowedPath || path.startsWith("/api/portfolio")
      )
    ) {
      // 서브도메인 유지하면서 루트 경로로 리다이렉트
      await sendRedirect(event, "/");
    }
  }
});
