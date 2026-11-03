import { useState, type FormEvent } from "react";

import { signUpWithEmail } from "@/services/authService";
import { formatAuthErrorMessage } from "@/shared/auth/utils/formatAuthErrorMessage";
import { MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";

export function useSignupForm(homePath: string) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
      return;
    }

    setIsSubmitting(true);
    const result = await signUpWithEmail(email.trim(), password, name.trim(), homePath);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(formatAuthErrorMessage(result.error.message));
    } else if (result.requiresEmailConfirmation) {
      setSuccess("Account created. Check your inbox for the confirmation link.");
    }
  }

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
  };
}
