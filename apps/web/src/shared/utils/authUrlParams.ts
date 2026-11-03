import { AUTH_FORM_TYPE_PARAM, type AuthFormType } from "@/shared/constants/auth";

export function buildAuthUrl(authPath: string, formType: AuthFormType): string {
  const params = new URLSearchParams({ [AUTH_FORM_TYPE_PARAM]: formType });
  return `${authPath}?${params.toString()}`;
}

/** The page a guard sent the visitor away from, or `fallback`. */
export function requestedPath(locationState: unknown, fallback: string): string {
  const from = (locationState as { from?: { pathname?: string; search?: string } } | null)?.from;
  return from?.pathname ? `${from.pathname}${from.search ?? ""}` : fallback;
}

/** Same-origin paths only, so a crafted `next` can't redirect off the site. */
export function safeNextPath(next: string | null, fallback: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
