import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";

const STORAGE_KEY = "dayflow-password-recovery";

export function markPasswordRecoveryPending() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private mode / disabled storage — URL + auth events still apply.
  }
}

export function clearPasswordRecoveryPending() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasPasswordRecoveryPending(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** True when the current URL is a Supabase recovery callback. */
export function urlIndicatesPasswordRecovery(): boolean {
  const search = new URLSearchParams(window.location.search);
  if (search.get("form-type") === AUTH_FORM_TYPES.resetPassword) {
    return true;
  }
  if (search.get("type") === "recovery") {
    return true;
  }
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return hash.get("type") === "recovery";
}

export function isPasswordRecoveryContext(): boolean {
  return urlIndicatesPasswordRecovery() || hasPasswordRecoveryPending();
}
