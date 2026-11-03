import { useAuth } from "@/shared/hooks/useAuth";
import { getAvatarUrl, getDisplayName, getInitials } from "@/shared/utils/authUserDisplay";

export function useUserDisplay() {
  const { user, profile } = useAuth();
  const displayName = getDisplayName(user, profile?.display_name);

  return {
    displayName,
    firstName: displayName.split(/\s+/)[0] || displayName,
    initials: getInitials(displayName),
    avatarUrl: getAvatarUrl(user, profile?.avatar_url),
    email: user?.email ?? "",
  };
}
