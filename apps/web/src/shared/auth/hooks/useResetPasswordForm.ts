import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { updatePassword } from "@/services/authService";
import { MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { showToast } from "@/shared/utils/showToast";

export function useResetPasswordForm(homePath: string) {
  const { clearPasswordRecovery } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const authError = await updatePassword(password);
    setIsSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    clearPasswordRecovery();
    showToast("success", "Password updated.");
    void navigate(homePath, { replace: true });
  }

  return { password, setPassword, confirm, setConfirm, error, isSubmitting, handleSubmit };
}
