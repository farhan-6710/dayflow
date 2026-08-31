import { useCallback, useState, type FormEvent } from "react";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { formatAuthErrorMessage } from "@/features/workspace/auth/utils/formatAuthErrorMessage";

export function useLoginForm() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setIsSubmitting(true);

      const authError = await signInWithEmail(email.trim(), password);
      if (authError) {
        setError(formatAuthErrorMessage(authError.message));
      }

      setIsSubmitting(false);
    },
    [email, password, signInWithEmail],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    clearError,
  };
}
