/**
 * Form validation utilities
 * Centralized validation logic for enterprise-grade form handling
 */

export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a value against multiple rules
 */
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[]
): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = "This field is required"): ValidationRule<string> => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  minLength: (
    min: number,
    message = `Minimum length is ${min} characters`
  ): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message,
  }),

  maxLength: (
    max: number,
    message = `Maximum length is ${max} characters`
  ): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message,
  }),

  numberRange: (
    min: number,
    max: number,
    message = `Must be between ${min} and ${max}`
  ): ValidationRule<number> => ({
    validate: (value) => value >= min && value <= max,
    message,
  }),

  email: (message = "Invalid email address"): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  pattern: (
    pattern: RegExp,
    message = "Invalid format"
  ): ValidationRule<string> => ({
    validate: (value) => pattern.test(value),
    message,
  }),

  custom: <T>(
    validatorFn: (value: T) => boolean,
    message: string
  ): ValidationRule<T> => ({
    validate: validatorFn,
    message,
  }),
};

/**
 * Reminder-specific validation rules
 */
export const reminderValidationRules = {
  hour: (): ValidationRule<number>[] => [
    validationRules.numberRange(0, 23, "Hour must be between 0 and 23"),
  ],

  minute: (): ValidationRule<number>[] => [
    validationRules.numberRange(0, 59, "Minute must be between 0 and 59"),
  ],

  name: (): ValidationRule<string>[] => [
    validationRules.required("Reminder name is required"),
    validationRules.minLength(3, "Name must be at least 3 characters"),
    validationRules.maxLength(100, "Name must not exceed 100 characters"),
  ],

  description: (): ValidationRule<string>[] => [
    validationRules.maxLength(
      500,
      "Description must not exceed 500 characters"
    ),
  ],
};
