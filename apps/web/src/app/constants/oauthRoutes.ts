/** Shared OAuth popup callback: same origin for both portals. Allow-listed in Supabase. */
export const OAUTH_CALLBACK_PATH = "/auth/oauth-callback";

/** Desktop OAuth bridge. Allow-listed in Supabase, so the path must keep working. */
export const DESKTOP_OAUTH_BRIDGE_PATH = "/auth/desktop-oauth-bridge";

/** postMessage type the OAuth popup uses to report back to its opener. */
export const OAUTH_CALLBACK_MESSAGE_TYPE = "dayflow-oauth-callback";

/** Deep link registered by the installed desktop app. */
export const DESKTOP_OAUTH_CALLBACK_SCHEME = "dayflow://auth/callback";
