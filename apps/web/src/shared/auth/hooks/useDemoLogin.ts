import { useState } from "react";

import { signInWithEmail } from "@/services/authService";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { formatAuthErrorMessage } from "@/shared/auth/utils/formatAuthErrorMessage";

/** On success the auth listener updates the session and the public route guard redirects. */
export function useDemoLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function login() {
    setError(null);
    setIsSubmitting(true);
    const authError = await signInWithEmail(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
    if (authError) {
      setError(formatAuthErrorMessage(authError.message));
    }
    setIsSubmitting(false);
  }

  return { error, isSubmitting, login };
}
