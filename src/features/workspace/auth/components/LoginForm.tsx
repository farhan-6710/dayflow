import { Link } from "react-router";

import {
  AuthEmailField,
  AuthFormAlert,
  AuthPasswordField,
} from "@/features/workspace/auth/components/AuthFormFields";
import { DemoAccountLoginPrompt } from "@/features/workspace/auth/components/DemoAccountLoginPrompt";
import { AuthOAuthSignIn } from "@/features/workspace/auth/components/AuthOAuthSignIn";
import { authFormStyles } from "@/features/workspace/auth/components/authFormStyles";
import { formFieldGroupClassName } from "@/shared/constants/formStyles";
import { AUTH_FORM_TYPES } from "@/features/workspace/auth/constants/auth";
import { useLoginForm } from "@/features/workspace/auth/hooks/useLoginForm";
import { DASHBOARD_HOME } from "@/features/workspace/auth/constants/routes";
import { buildAuthUrl } from "@/features/workspace/auth/utils/authUrlParams";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LoginForm({
  oauthRedirectPath = DASHBOARD_HOME,
}: {
  oauthRedirectPath?: string;
} = {}) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    loginWithDemoAccount,
    clearError,
  } = useLoginForm();

  return (
    <>
      <DemoAccountLoginPrompt
        disabled={isSubmitting}
        onDemoLogin={loginWithDemoAccount}
      />

      <div className="space-y-6">
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <AuthEmailField
            id="login-email"
            value={email}
            onChange={setEmail}
            disabled={isSubmitting}
          />

          <div className={formFieldGroupClassName}>
            <AuthPasswordField
              id="login-password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Link
                to={buildAuthUrl(AUTH_FORM_TYPES.forgotPassword)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error ? <AuthFormAlert message={error} variant="error" /> : null}

          <Button
            type="submit"
            className={cn(authFormStyles.submitButton, "mt-2")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <AuthOAuthSignIn
          disabled={isSubmitting}
          oauthRedirectPath={oauthRedirectPath}
          onError={setError}
          onBeforeSignIn={clearError}
        />
      </div>
    </>
  );
}
