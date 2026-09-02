export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 6;

export const validateEmail = (email: string): ValidationError | null => {
  if (!email.trim()) {
    return { field: "email", message: "Email is required" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      field: "password",
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }
  return null;
};

export const validateFullName = (fullName: string): ValidationError | null => {
  if (!fullName.trim()) {
    return { field: "fullName", message: "Full name is required" };
  }
  if (fullName.trim().length < 2) {
    return {
      field: "fullName",
      message: "Full name must be at least 2 characters",
    };
  }
  return null;
};

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignupForm = (data: {
  fullName: string;
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const fullNameError = validateFullName(data.fullName);
  if (fullNameError) errors.push(fullNameError);

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};
