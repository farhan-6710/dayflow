/** Shared demo workspace credentials (see docs/README.md). */
export const DEMO_ACCOUNT = {
  email: "dayflow.demo@gmail.com",
  password: "D@1234",
} as const;

export function isDemoAccountEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return email.trim().toLowerCase() === DEMO_ACCOUNT.email.toLowerCase();
}
