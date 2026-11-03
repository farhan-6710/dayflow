import { AUTH_FORM_TYPE_PARAM, AUTH_FORM_TYPES } from "@/shared/constants/auth";

const STORAGE_KEY = "dayflow-password-recovery";

export function markPasswordRecoveryPending() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private mode / disabled storage: URL and auth events still apply.
  }
}

export function clearPasswordRecoveryPending() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}

function hasPasswordRecoveryPending(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** True when the current URL is a Supabase recovery callback. */
function urlIndicatesPasswordRecovery(): boolean {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    search.get(AUTH_FORM_TYPE_PARAM) === AUTH_FORM_TYPES.resetPassword ||
    search.get("type") === "recovery" ||
    hash.get("type") === "recovery"
  );
}

export function isPasswordRecoveryContext(): boolean {
  return urlIndicatesPasswordRecovery() || hasPasswordRecoveryPending();
}
