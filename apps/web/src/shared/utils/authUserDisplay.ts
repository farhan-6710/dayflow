import type { User } from "@supabase/supabase-js";

function metadataString(user: User, key: string): string | undefined {
  const value: unknown = user.user_metadata?.[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function getDisplayName(user: User | null, profileName?: string | null): string {
  const fromProfile = profileName?.trim();
  if (fromProfile) {
    return fromProfile;
  }
  if (!user) {
    return "Guest";
  }
  return (
    metadataString(user, "full_name") ??
    metadataString(user, "name") ??
    user.email?.split("@")[0] ??
    "User"
  );
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  return `${first}${last}`.toUpperCase();
}

export function getAvatarUrl(user: User | null, profileAvatar?: string | null): string | null {
  if (profileAvatar) {
    return profileAvatar;
  }
  return user ? (metadataString(user, "avatar_url") ?? metadataString(user, "picture") ?? null) : null;
}
