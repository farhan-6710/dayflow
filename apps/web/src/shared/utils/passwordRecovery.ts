import { AUTH_FORM_TYPE_PARAM, AUTH_FORM_TYPES } from "@/shared/constants/auth";

/** True when the current URL is a Supabase password-recovery callback. */
export function isPasswordRecoveryUrl(): boolean {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    search.get(AUTH_FORM_TYPE_PARAM) === AUTH_FORM_TYPES.resetPassword ||
    search.get("type") === "recovery" ||
    hash.get("type") === "recovery"
  );
}
