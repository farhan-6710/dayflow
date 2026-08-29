import type { ReactNode } from "react";
import { authFormStyles } from "@/features/admin/auth/components/authFormStyles";
import { FacebookIcon } from "@/features/admin/auth/components/FacebookIcon";
import { GoogleIcon } from "@/features/admin/auth/components/GoogleIcon";
import type { AuthOAuthSignInProps } from "@/features/admin/auth/types/components";
import { showToast } from "@/shared/utils/showToast";
import { Button } from "@/shared/ui/button";

const OAUTH_OPTIONS: Array<{
  provider: string;
  label: string;
  icon: ReactNode;
  enabled: boolean;
}> = [
  { provider: "google", label: "Continue with Google", icon: <GoogleIcon />, enabled: false },
  {
    provider: "facebook",
    label: "Continue with Facebook",
    icon: <FacebookIcon />,
    enabled: false,
  },
];

export function AuthOAuthSignIn({
  disabled = false,
}: AuthOAuthSignInProps) {
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
          return (
            <Button
              key={option.provider}
              type="button"
              variant="outline"
              className={authFormStyles.oauthButton}
              onClick={() => {
                showToast(
                  "info",
                  `${option.label.split(" ").slice(-1)[0]} sign-in is coming soon. Use email for now.`,
                );
              }}
              disabled={disabled}
            >
              {option.icon}
              {option.label}
            </Button>
          );
        })}
      </div>
    </>
  );
}
