import type { H3Event } from "h3";

// 이벤트 컨텍스트 타입 확장
declare module "h3" {
  interface H3EventContext {
    subdomain?: string;
  }
}

/**
 * 현재 요청의 서브도메인을 가져오는 유틸리티 함수
 */
export function getSubdomain(event: H3Event): string {
  return event.context.subdomain || "main";
}
