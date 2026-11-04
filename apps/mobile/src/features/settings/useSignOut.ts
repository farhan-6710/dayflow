import { useAuth } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { showToast } from "@/ui/Toaster";

export function useSignOut() {
  const { signOut } = useAuth();
  return async () => {
    const ok = await confirm({ title: "Log out?", message: "You'll need to sign in again to get back to your account.", confirmLabel: "Log out", destructive: false });
    if (!ok) return;
    try {
      await signOut();
    } catch {
      showToast("error", "Couldn't log you out. Check your connection and try again.");
    }
  };
}
