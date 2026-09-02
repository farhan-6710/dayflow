/** Shared demo workspace credentials (see docs/README.md). */
export const DEMO_ACCOUNT = {
  email: "dayflow.demo@gmail.com",
  password: "F@6710",
} as const;

export function isDemoAccountEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return email.trim().toLowerCase() === DEMO_ACCOUNT.email.toLowerCase();
}
