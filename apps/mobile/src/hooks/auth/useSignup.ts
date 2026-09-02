import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { validateSignupForm } from "@utils/validation";
import { authToast, getUserDisplayName } from "@utils/toast";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Hook for handling user signup
 * Manages signup state, validation, and navigation with centralized error handling
 *
 * @returns Object with handleSignup function and loading state
 *
 * @example
 * const { handleSignup, loading } = useSignup();
 * await handleSignup({ fullName: "John Doe", email: "user@example.com", password: "123456" });
 */
export const useSignup = () => {
  const { signUpWithEmail } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (formData: SignupFormData) => {
    // Validate form
    const validation = validateSignupForm(formData);
    if (!validation.isValid) {
      authToast.validationError(validation);
      return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim()
      );

      const userName = getUserDisplayName(
        user?.user_metadata,
        formData.email,
        formData.fullName
      );
      authToast.signupSuccess(userName);

      router.push("/(tabs)");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : undefined;
      authToast.authError("Signup failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignup,
    loading,
  };
};
