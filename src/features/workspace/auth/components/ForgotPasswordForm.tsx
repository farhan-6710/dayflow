import { Link } from "react-router";

import {
  AuthEmailField,
  AuthFormAlert,
} from "@/features/admin/auth/components/AuthFormFields";
import { authFormStyles } from "@/features/admin/auth/components/authFormStyles";
import { AUTH_FORM_TYPES } from "@/features/admin/auth/constants/auth";
import { useForgotPasswordForm } from "@/features/admin/auth/hooks/useForgotPasswordForm";
import { buildAuthUrl } from "@/features/admin/auth/utils/authUrlParams";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ForgotPasswordForm({
  redirectPath,
  loginPath = buildAuthUrl(AUTH_FORM_TYPES.login),
}: {
  redirectPath?: string;
  loginPath?: string;
} = {}) {
  const { email, setEmail, error, success, isSubmitting, handleSubmit } =
    useForgotPasswordForm(redirectPath);

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <AuthEmailField
          id="forgot-password-email"
          value={email}
          onChange={setEmail}
          disabled={isSubmitting}
        />

        {error ? <AuthFormAlert message={error} variant="error" /> : null}
        {success ? <AuthFormAlert message={success} variant="success" /> : null}

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isSubmitting || !email.trim()}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          to={loginPath}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
