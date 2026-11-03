import { useState, type FormEvent } from "react";

import { updateAuthDisplayName } from "@/services/authService";
import { updateProfile } from "@/services/profilesService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { showToast } from "@/shared/utils/showToast";

export function useProfileForm() {
  const { user, profile, refreshUser } = useAuth();
  const savedName = profile?.display_name ?? "";
  const savedAvatar = profile?.avatar_url ?? "";
  const [displayName, setDisplayName] = useState(savedName);
  const [avatarUrl, setAvatarUrl] = useState(savedAvatar);
  const [saving, setSaving] = useState(false);
  const isDirty = displayName !== savedName || avatarUrl !== savedAvatar;

  /** Throws on failure so the unsaved-changes modal stays open. */
  async function save() {
    if (!user) {
      return;
    }
    setSaving(true);
    try {
      const name = displayName.trim();
      await updateProfile(user.id, {
        display_name: name || null,
        avatar_url: avatarUrl.trim() || null,
      });
      if (name) {
        const metadataError = await updateAuthDisplayName(name);
        if (metadataError) {
          console.error("Failed to sync auth display name:", metadataError);
        }
      }
      await refreshUser();
      showToast("success", "Profile saved.");
    } catch (error) {
      console.error("Failed to save profile:", error);
      showToast("error", "Couldn't save your profile. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  useRegisterUnsavedChanges({ id: "settings-profile", isDirty, onSave: save });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save().catch(() => undefined);
  }

  return { displayName, setDisplayName, avatarUrl, setAvatarUrl, saving, isDirty, handleSubmit };
}
