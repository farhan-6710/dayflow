import { useCallback, useState, type FormEvent } from "react";

import { MIN_AUTH_PASSWORD_LENGTH } from "@/features/workspace/auth/constants/auth";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import {
  AUTH_SIGNUP_EMAIL_SENT_MESSAGE,
  formatAuthErrorMessage,
} from "@/features/workspace/auth/utils/formatAuthErrorMessage";

export function useSignupForm(emailRedirectPath?: string) {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);

      if (!name.trim()) {
        setError("Name is required.");
        return;
      }

      if (password.length < MIN_AUTH_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_AUTH_PASSWORD_LENGTH} characters.`);
        return;
      }

      setIsSubmitting(true);

      const result = await signUpWithEmail(
        email.trim(),
        password,
        name.trim(),
        emailRedirectPath,
      );

      if (!result.ok) {
        setError(formatAuthErrorMessage(result.error.message));
      } else if (result.requiresEmailConfirmation) {
        setSuccess(AUTH_SIGNUP_EMAIL_SENT_MESSAGE);
      }

      setIsSubmitting(false);
    },
    [email, emailRedirectPath, name, password, signUpWithEmail],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    isSubmitting,
    handleSubmit,
    clearError,
  };
}
