export const AUTH_EMAIL_CONFIRMATION_REQUIRED_MESSAGE =
  "Please confirm your email. Check your inbox for the confirmation link.";

export const AUTH_SIGNUP_EMAIL_SENT_MESSAGE =
  "Account created! Please confirm your email — check your inbox for the confirmation link.";

export function formatAuthErrorMessage(message: string): string {
  const normalized = message.trim().toLowerCase();

  if (
    normalized.includes("email not confirmed") ||
    normalized.includes("email_not_confirmed")
  ) {
    return AUTH_EMAIL_CONFIRMATION_REQUIRED_MESSAGE;
  }

  return message;
}
