export const AUTH_FORM_TYPE_PARAM = "form-type";

export const AUTH_FORM_TYPES = {
  login: "login",
  signup: "signup",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
} as const;

export type AuthFormType = (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];

/** Supabase minimum. */
export const MIN_PASSWORD_LENGTH = 6;
