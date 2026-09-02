import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { updateProfile } from "@/services/profilesService";
import {
  requestPasswordReset,
  updateAuthDisplayName,
  updateEmail as apiUpdateEmail,
  updatePassword as apiUpdatePassword,
} from "@/services/authService";
import { ACCOUNT_PASSWORD_MIN_LENGTH } from "@/shared/constants/accountPassword";
import { showToast } from "@/shared/utils/showToast";
import { userHasPasswordLogin } from "@/shared/utils/authUserDisplay";
import { useTheme } from "@/shared/providers/ThemeProvider";

export function useSettings() {
  const { user, profile, refreshProfile, refreshUser } = useAuth();
  const { isDarkMode, setDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [emailChangeConfirmOpen, setEmailChangeConfirmOpen] = useState(false);
  const [sendingResetLink, setSendingResetLink] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);

  const pendingEmail = user?.new_email ?? null;
  const hasPasswordLogin = userHasPasswordLogin(user);
  const currentEmail = user?.email ?? "";

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  useEffect(() => {
    setNewEmail("");
  }, [user?.email]);

  // After clicking a Supabase email-change link, re-fetch the user and explain status.
  useEffect(() => {
    const hash = window.location.hash;
    const hasAuthCallback =
      searchParams.has("email-change") ||
      searchParams.has("code") ||
      searchParams.get("type") === "email_change" ||
      hash.includes("type=email_change") ||
      hash.includes("access_token");

    if (!hasAuthCallback) return;

    let cancelled = false;

    void (async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      const nextUser = await refreshUser();
      if (cancelled) return;

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("email-change");
      nextParams.delete("code");
      nextParams.delete("type");
      setSearchParams(nextParams, { replace: true });
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }

      if (!nextUser) {
        showToast("error", "Could not verify email change. Try signing in again.");
        return;
      }

      if (nextUser.new_email) {
        showToast(
          "success",
          `Almost done — also confirm the link sent to your current inbox (${nextUser.email}). Secure email change needs both confirmations.`,
        );
        return;
      }

      showToast("success", `Email updated to ${nextUser.email}.`);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot on callback URL
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSavingProfile(true);
      const nextName = displayName.trim();
      await updateProfile(user.id, {
        display_name: nextName || null,
        avatar_url: avatarUrl.trim() || null,
      });
      if (nextName) {
        const metaError = await updateAuthDisplayName(nextName);
        if (metaError) {
          console.error("Failed to sync auth display name:", metaError);
        }
      }
      await refreshUser();
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

  const openEmailChangeConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = newEmail.trim().toLowerCase();
    if (!nextEmail || nextEmail === currentEmail.toLowerCase()) {
      showToast("error", "Enter a different email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      showToast("error", "Enter a valid email address.");
      return;
    }
    setEmailChangeConfirmOpen(true);
  };

  const handleConfirmEmailChange = async () => {
    const nextEmail = newEmail.trim().toLowerCase();
    try {
      setUpdatingEmail(true);
      const { error } = await apiUpdateEmail(nextEmail);
      if (error) {
        showToast("error", error.message || "Failed to start email change. Try again.");
        return;
      }
      setEmailChangeConfirmOpen(false);
      setNewEmail("");
      await refreshUser();
      showToast("success", "Verification links sent. Check both inboxes.");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to start email change. Try again.");
    } finally {
      setUpdatingEmail(false);
    }
  };

  /** Email/password users: Supabase reset-password email flow. */
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountEmail = user?.email?.trim();
    if (!accountEmail) {
      showToast("error", "No email on this account to send a reset link.");
      return;
    }
    try {
      setSendingResetLink(true);
      const err = await requestPasswordReset(accountEmail);
      if (err) {
        showToast("error", err.message || "Failed to send reset link.");
        return;
      }
      showToast(
        "success",
        `Reset link sent to ${accountEmail}. Open it to choose a new password.`,
      );
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to send reset link. Try again.");
    } finally {
      setSendingResetLink(false);
    }
  };

  /** OAuth users (e.g. Google): set an email/password credential while signed in. */
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    if (password.trim().length < ACCOUNT_PASSWORD_MIN_LENGTH) {
      showToast(
        "error",
        `Password must be at least ${ACCOUNT_PASSWORD_MIN_LENGTH} characters.`,
      );
      return;
    }
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    try {
      setSettingPassword(true);
      const err = await apiUpdatePassword(password.trim());
      if (err) {
        showToast("error", err.message || "Failed to set password.");
        return;
      }
      setPassword("");
      setConfirmPassword("");
      await refreshUser();
      showToast(
        "success",
        "Password set. You can now sign in with email and password as well.",
      );
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to set password. Try again.");
    } finally {
      setSettingPassword(false);
    }
  };

  return {
    user,
    profile,
    hasPasswordLogin,
    currentEmail,
    displayName,
    setDisplayName,
    avatarUrl,
    setAvatarUrl,
    newEmail,
    setNewEmail,
    pendingEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    savingProfile,
    updatingEmail,
    emailChangeConfirmOpen,
    setEmailChangeConfirmOpen,
    sendingResetLink,
    settingPassword,
    isDarkMode,
    handleUpdateProfile,
    handleUpdateTheme,
    openEmailChangeConfirm,
    handleConfirmEmailChange,
    handleRequestPasswordReset,
    handleSetPassword,
  };
}
