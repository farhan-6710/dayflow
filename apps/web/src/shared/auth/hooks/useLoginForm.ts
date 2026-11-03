import { useState, type FormEvent } from "react";

import { signInWithEmail } from "@/services/authService";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { formatAuthErrorMessage } from "@/shared/auth/utils/formatAuthErrorMessage";

/** On success the auth listener updates the session and the public route guard redirects. */
export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signIn(nextEmail: string, nextPassword: string) {
    setError(null);
    setIsSubmitting(true);
    const authError = await signInWithEmail(nextEmail.trim(), nextPassword);
    if (authError) {
      setError(formatAuthErrorMessage(authError.message));
    }
    setIsSubmitting(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void signIn(email, password);
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    loginWithDemoAccount: () => void signIn(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password),
  };
}
