import { useState, type FormEvent } from "react";

import { requestPasswordReset, updatePassword } from "@/services/authService";
import { AUTH_FORM_TYPES, MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";
import { userHasPasswordLogin } from "@/shared/utils/authUserDisplay";
import { showToast } from "@/shared/utils/showToast";

export function usePasswordForm(authPath: string) {
  const { user, refreshUser } = useAuth();
  const email = user?.email ?? "";
  const hasPasswordLogin = userHasPasswordLogin(user);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  /** Email/password accounts: the emailed reset-link flow. */
  async function sendResetLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const error = await requestPasswordReset(email, buildAuthUrl(authPath, AUTH_FORM_TYPES.resetPassword));
    setSaving(false);
    if (error) {
      showToast("error", error.message);
    } else {
      showToast("success", `Reset link sent to ${email}.`);
    }
  }

  /** Google accounts: add a password while signed in. Throws on failure so the unsaved-changes modal stays open. */
  async function savePassword() {
    const problem =
      password.length < MIN_PASSWORD_LENGTH
        ? `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`
        : password !== confirm
          ? "Those passwords don't match."
          : null;
    if (problem) {
      showToast("error", problem);
      throw new Error(problem);
    }

    setSaving(true);
    try {
      const error = await updatePassword(password);
      if (error) {
        showToast("error", error.message);
        throw error;
      }
      setPassword("");
      setConfirm("");
      await refreshUser();
      showToast("success", "Password set. You can now sign in with your email too.");
    } finally {
      setSaving(false);
    }
  }

  useRegisterUnsavedChanges({
    id: "settings-password",
    isDirty: !hasPasswordLogin && (password.length > 0 || confirm.length > 0),
    onSave: savePassword,
  });

  function handleSetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    savePassword().catch(() => undefined);
  }

  return { email, hasPasswordLogin, password, setPassword, confirm, setConfirm, saving, sendResetLink, handleSetPassword };
}
