import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { updateProfile } from "@/services/profilesService";
import { updatePassword as apiUpdatePassword } from "@/services/authService";
import { showToast } from "@/shared/utils/showToast";
import { useTheme } from "@/shared/providers/ThemeProvider";

export function useSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const { isDarkMode, setDarkMode } = useTheme();
  
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSavingProfile(true);
      await updateProfile(user.id, {
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });
      await refreshProfile();
      showToast("success", "Profile updated successfully!");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateTheme = async (dark: boolean) => {
    if (!user) return;
    try {
      setDarkMode(dark);
      await updateProfile(user.id, {
        theme_preference: dark ? "dark" : "light",
      });
      await refreshProfile();
      showToast("success", `Theme set to ${dark ? "dark" : "light"}`);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update theme preference");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    try {
      setUpdatingPassword(true);
      const err = await apiUpdatePassword(password.trim());
      if (err) throw err;
      setPassword("");
      showToast("success", "Password updated successfully!");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update password. Password must be at least 6 characters.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return {
    user,
    profile,
    displayName,
    setDisplayName,
    avatarUrl,
    setAvatarUrl,
    password,
    setPassword,
    savingProfile,
    updatingPassword,
    isDarkMode,
    handleUpdateProfile,
    handleUpdateTheme,
    handleUpdatePassword,
  };
}
