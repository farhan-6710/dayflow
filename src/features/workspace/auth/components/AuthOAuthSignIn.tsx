import { useState, type ReactNode } from "react";

import type { Provider } from "@supabase/supabase-js";

import { authFormStyles } from "@/features/workspace/auth/components/authFormStyles";
import { FacebookIcon } from "@/features/workspace/auth/components/FacebookIcon";
import { GoogleIcon } from "@/features/workspace/auth/components/GoogleIcon";
import { DASHBOARD_HOME } from "@/features/workspace/auth/constants/routes";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import type { AuthOAuthSignInProps } from "@/features/workspace/auth/types/components";
import { formatAuthErrorMessage } from "@/features/workspace/auth/utils/formatAuthErrorMessage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { isDesktopApp } from "@/shared/utils/platform";
import { showToast } from "@/shared/utils/showToast";
import { Button } from "@/shared/ui/button";

const OAUTH_OPTIONS: Array<{
  provider: Provider;
  label: string;
  icon: ReactNode;
  enabled: boolean;
}> = [
  { provider: "google", label: "Continue with Google", icon: <GoogleIcon />, enabled: true },
  {
    provider: "facebook",
    label: "Continue with Facebook",
    icon: <FacebookIcon />,
    enabled: false,
  },
];

export function AuthOAuthSignIn({
  disabled = false,
  oauthRedirectPath = DASHBOARD_HOME,
  onError,
  onBeforeSignIn,
}: AuthOAuthSignInProps) {
  const { signInWithOAuthProvider } = useAuth();
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);

  const handleOAuthClick = async (
    provider: Provider,
    enabled: boolean,
    label: string,
  ) => {
    if (!enabled) {
      showToast(
        "info",
        `${label.split(" ").slice(-1)[0]} sign-in is coming soon. Use email for now.`,
      );
      return;
    }

    onBeforeSignIn?.();
    setActiveProvider(provider);

    if (isDesktopApp()) {
      showToast("info", "Opening your browser to sign in with Google…");
    }

    const result = await signInWithOAuthProvider(provider, {
      redirectPath: oauthRedirectPath,
    });

    setActiveProvider(null);

    if (result.ok) {
      return;
    }

    if (result.popupBlocked) {
      showToast(
        "error",
        "Popup blocked. Allow popups for this site and try again.",
      );
      return;
    }

    if (result.cancelled) {
      showToast("info", "Google sign-in was cancelled.");
      return;
    }

    onError(formatAuthErrorMessage(result.error?.message ?? "Google sign-in failed."));
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center">
          <span className={authFormStyles.divider}>Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        {OAUTH_OPTIONS.map((option) => {
          const isLoading = activeProvider === option.provider;

          return (
            <Button
              key={option.provider}
              type="button"
              variant="outline"
              className={authFormStyles.oauthButton}
              onClick={() => void handleOAuthClick(option.provider, option.enabled, option.label)}
              disabled={disabled || activeProvider !== null}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : option.icon}
              {isLoading ? "Signing in..." : option.label}
            </Button>
          );
        })}
      </div>
    </>
  );
}
