import { useCallback, useState, type FormEvent } from "react";

import { DEMO_ACCOUNT } from "@/features/workspace/auth/constants/demoAccount";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { formatAuthErrorMessage } from "@/features/workspace/auth/utils/formatAuthErrorMessage";

export function useLoginForm() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = useCallback(
    async (nextEmail: string, nextPassword: string) => {
      setError(null);
      setIsSubmitting(true);

      const authError = await signInWithEmail(nextEmail.trim(), nextPassword);
      if (authError) {
        setError(formatAuthErrorMessage(authError.message));
      }

      setIsSubmitting(false);
    },
    [signInWithEmail],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await signIn(email, password);
    },
    [email, password, signIn],
  );

  const loginWithDemoAccount = useCallback(async () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    await signIn(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
  }, [signIn]);

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
    loginWithDemoAccount,
    clearError,
  };
}
