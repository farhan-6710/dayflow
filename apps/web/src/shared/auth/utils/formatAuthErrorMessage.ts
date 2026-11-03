export function formatAuthErrorMessage(message: string): string {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("email not confirmed") || normalized.includes("email_not_confirmed")) {
    return "Please confirm your email. Check your inbox for the confirmation link.";
  }
  if (normalized.includes("invalid login credentials")) {
    return "That email and password don't match. Check them and try again.";
  }
  if (normalized.includes("access_denied") || normalized.includes("access denied")) {
    return "Sign-in was cancelled.";
  }
  return message;
}
