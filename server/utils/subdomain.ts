import type { H3Event } from "h3";

declare module "h3" {
  interface H3EventContext {
    subdomain?: string;
  }
}

export function getSubdomain(event: H3Event): string {
  return event.context.subdomain || "main";
}
