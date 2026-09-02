import Toast from "react-native-toast-message";
import { ValidationResult } from "./validation";

/**
 * Authentication toast utilities
 * Centralized toast messaging for consistent UX
 */

export const authToast = {
  /**
   * Show validation error toast
   */
  validationError: (validation: ValidationResult) => {
    const firstError = validation.errors[0];
    if (firstError) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: firstError.message,
      });
    }
  },

  /**
   * Show login success toast
   */
  loginSuccess: (userName: string) => {
    Toast.show({
      type: "success",
      text1: `Welcome back, ${userName}!`,
      text2: "You're now logged in.",
    });
  },

  /**
   * Show signup success toast
   */
  signupSuccess: (userName: string) => {
    Toast.show({
      type: "success",
      text1: `Welcome, ${userName}!`,
      text2: "Your account has been created.",
    });
  },

  /**
   * Show authentication error toast
   */
  authError: (title: string, message?: string) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message ?? "Please check your details and try again.",
    });
  },
};

/**
 * Extract user display name from user metadata or email
 */
export function getUserDisplayName(
  userMetadata?: { full_name?: string },
  fallbackEmail?: string,
  fallbackName?: string
): string {
  return (
    userMetadata?.full_name ||
    fallbackName ||
    fallbackEmail?.split("@")[0] ||
    "User"
  );
}
