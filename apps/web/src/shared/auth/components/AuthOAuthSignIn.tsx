import { useState } from "react";
import { Loader2 } from "lucide-react";

import { signInWithOAuthProvider } from "@/services/oauthService";
import { GoogleIcon } from "@/shared/auth/components/GoogleIcon";
import type { AuthOAuthSignInProps } from "@/shared/auth/types/components";
import { formatAuthErrorMessage } from "@/shared/auth/utils/formatAuthErrorMessage";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/utils/showToast";

export function AuthOAuthSignIn({ disabled = false, redirectPath, onError, onBeforeSignIn }: AuthOAuthSignInProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    onBeforeSignIn();
    setLoading(true);
    const result = await signInWithOAuthProvider("google", redirectPath);
    setLoading(false);

    if (result.ok) {
      return;
    }
    if (result.popupBlocked) {
      showToast("error", "Your browser blocked the sign-in popup. Allow popups for this site and try again.");
    } else if (result.cancelled) {
      showToast("info", "Google sign-in was cancelled.");
    } else {
      onError(formatAuthErrorMessage(result.message ?? "Google sign-in failed. Please try again."));
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={disabled || loading}
        onClick={() => void handleClick()}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <GoogleIcon />}
        Continue with Google
      </Button>
    </>
  );
}
