import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { applyAuthCallback } from "@/services/authService";
import { showToast } from "@/ui/Toaster";

/** Landing route for `dayflow://auth/callback`: email confirmation, password reset and Google. */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    void (async () => {
      const incoming = url ?? (await Linking.getInitialURL());
      if (!incoming) {
        router.replace("/");
        return;
      }
      const { recovery, error } = await applyAuthCallback(incoming);
      if (error) showToast("error", error);
      router.replace(recovery && !error ? "/reset-password" : "/");
    })();
  }, [url, router]);

  return <CenteredSpinner />;
}
