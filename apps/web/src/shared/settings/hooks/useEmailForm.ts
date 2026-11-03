import { useState, type FormEvent } from "react";

import { updateEmail } from "@/services/authService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { showToast } from "@/shared/utils/showToast";

export function useEmailForm(settingsPath: string) {
  const { user, refreshUser } = useAuth();
  const currentEmail = user?.email ?? "";
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nextEmail = newEmail.trim().toLowerCase();
  const canSubmit = nextEmail.length > 0 && nextEmail !== currentEmail.toLowerCase();

  /** Throws on failure so the unsaved-changes modal stays open. */
  async function save() {
    setSaving(true);
    try {
      const error = await updateEmail(nextEmail, `${settingsPath}?email-change=pending`);
      if (error) {
        throw error;
      }
      setConfirmOpen(false);
      setNewEmail("");
      await refreshUser();
      showToast("success", "Verification links sent. Check both inboxes.");
    } catch (error) {
      console.error("Failed to start email change:", error);
      showToast("error", error instanceof Error ? error.message : "Couldn't start the email change. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  useRegisterUnsavedChanges({ id: "settings-email", isDirty: canSubmit, onSave: save });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) {
      setConfirmOpen(true);
    }
  }

  return {
    currentEmail,
    pendingEmail: user?.new_email ?? null,
    newEmail,
    setNewEmail,
    nextEmail,
    canSubmit,
    saving,
    confirmOpen,
    setConfirmOpen,
    handleSubmit,
    confirm: () => save().catch(() => undefined),
  };
}
