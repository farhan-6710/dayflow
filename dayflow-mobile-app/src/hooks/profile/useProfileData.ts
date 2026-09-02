import { useState } from "react";
import type { UserProfile, ProfileStat, ProfileSection } from "@types";
import {
  DUMMY_USER,
  PROFILE_STATS,
  PROFILE_MENU_SECTIONS,
} from "@constants/profile";
import { getUserInitials, formatJoinedDate } from "@utils";
import { useUserDisplayData } from "@hooks";

export const useProfileData = () => {
  const { user: authUser, displayName, email } = useUserDisplayData();
  const [userProfile] = useState<UserProfile>(DUMMY_USER);
  const [stats] = useState<ProfileStat[]>(PROFILE_STATS);
  const [menuSections] = useState<ProfileSection[]>(PROFILE_MENU_SECTIONS);

  // Use real user data if available, otherwise use dummy data
  const profile: UserProfile = authUser
    ? {
        ...userProfile,
        name: displayName,
        email: email,
      }
    : userProfile;

  const initials = getUserInitials(profile.name);
  const joinedDate = formatJoinedDate(profile.joinedDate);

  const handleMenuItemPress = (itemId: string) => {
    // TODO: Implement actual navigation/actions
    switch (itemId) {
      case "theme":
        // Open theme settings
        break;
      case "notifications":
        // Toggle notifications
        break;
      case "sounds":
        // Toggle sounds
        break;
      case "logout":
        // Sign out user
        break;
      default:
        // Action not implemented
        break;
    }
  };

  return {
    profile,
    initials,
    joinedDate,
    stats,
    menuSections,
    handleMenuItemPress,
  };
};
