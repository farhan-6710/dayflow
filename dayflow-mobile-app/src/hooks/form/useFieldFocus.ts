import { useState, useCallback } from "react";

/**
 * Hook for managing field focus state
 * Eliminates duplicate focus management logic across form components
 *
 * @template T - The type of field identifiers (string literal union)
 * @returns Object with focusedField state and handlers
 *
 * @example
 * const { focusedField, handleFocus, handleBlur } = useFieldFocus<"email" | "password">();
 */
export function useFieldFocus<T extends string = string>() {
  const [focusedField, setFocusedField] = useState<T | null>(null);

  const handleFocus = useCallback((field: T) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const isFocused = useCallback(
    (field: T) => focusedField === field,
    [focusedField]
  );

  return {
    focusedField,
    handleFocus,
    handleBlur,
    isFocused,
  };
}
