import { useState, useCallback } from "react";

/**
 * Hook for managing password visibility toggle
 * Provides a clean interface for password show/hide functionality
 *
 * @param initialValue - Initial visibility state (default: false)
 * @returns Object with showPassword state and toggle function
 *
 * @example
 * const { showPassword, togglePassword } = usePasswordToggle();
 */
export function usePasswordToggle(initialValue = false) {
  const [showPassword, setShowPassword] = useState(initialValue);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    togglePassword,
    setShowPassword,
  };
}
