import { useOAuthCallback } from "@/shared/auth/hooks/useOAuthCallback";
import { CenteredLoading } from "@/shared/components/CenteredLoading";

export function OAuthCallbackPage() {
  useOAuthCallback();
  return <CenteredLoading />;
}
