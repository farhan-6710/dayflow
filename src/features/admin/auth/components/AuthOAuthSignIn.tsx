import { useState, type ReactNode } from "react";

import type { Provider } from "@supabase/supabase-js";

import { authFormStyles } from "@/features/admin/auth/components/authFormStyles";
import { FacebookIcon } from "@/features/admin/auth/components/FacebookIcon";
import { GoogleIcon } from "@/features/admin/auth/components/GoogleIcon";
import { DASHBOARD_HOME } from "@/features/admin/auth/constants/routes";
import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import type { AuthOAuthSignInProps } from "@/features/admin/auth/types/components";
import { formatAuthErrorMessage } from "@/features/admin/auth/utils/formatAuthErrorMessage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
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

    const error = await signInWithOAuthProvider(provider, {
      redirectPath: oauthRedirectPath,
    });

    if (error) {
      setActiveProvider(null);
      onError(formatAuthErrorMessage(error.message));
    }
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
              {isLoading ? "Redirecting..." : option.label}
            </Button>
          );
        })}
      </div>
    </>
  );
}
