import { useState, type FormEvent } from "react";

import { requestPasswordReset } from "@/services/authService";
import { AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

export function useForgotPasswordForm(authPath: string) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const authError = await requestPasswordReset(email, buildAuthUrl(authPath, AUTH_FORM_TYPES.resetPassword));
    setIsSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess("If an account exists for that email, we sent a reset link. Check your inbox.");
    }
  }

  return { email, setEmail, error, success, isSubmitting, handleSubmit };
}
