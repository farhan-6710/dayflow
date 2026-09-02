import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { validateLoginForm } from "@utils/validation";
import { authToast, getUserDisplayName } from "@utils/toast";

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Hook for handling user login
 * Manages login state, validation, and navigation with centralized error handling
 *
 * @returns Object with handleLogin function and loading state
 *
 * @example
 * const { handleLogin, loading } = useLogin();
 * await handleLogin({ email: "user@example.com", password: "123456" });
 */
export const useLogin = () => {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: LoginFormData) => {
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      authToast.validationError(validation);
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithEmail(
        formData.email.trim(),
        formData.password
      );

      const userName = getUserDisplayName(user?.user_metadata, formData.email);
      authToast.loginSuccess(userName);

      router.push("/(tabs)");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : undefined;
      authToast.authError("Login failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
  };
};
