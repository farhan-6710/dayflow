import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { AuthFormCard } from "@/features/workspace/auth/components/AuthFormCard";
import { AuthShellLayout } from "@/features/workspace/auth/components/AuthShellLayout";
import { ForgotPasswordForm } from "@/features/workspace/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/features/workspace/auth/components/LoginForm";
import { ResetPasswordForm } from "@/features/workspace/auth/components/ResetPasswordForm";
import { SignupForm } from "@/features/workspace/auth/components/SignupForm";
import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPE_VALUES,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/workspace/auth/constants/auth";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { buildClientAuthUrl } from "@/features/client/auth/utils/clientAuthUrlParams";
import {
  CLIENT_DASHBOARD_HOME,
} from "@/features/client/constants/routes";
import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

function isAuthFormType(value: string | null): value is AuthFormType {
  return (
    value !== null &&
    (AUTH_FORM_TYPE_VALUES as readonly string[]).includes(value)
  );
}

export function ClientAuthPage() {
  const { user, loading, profile, isPasswordRecovery } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawFormType = searchParams.get(AUTH_FORM_TYPE_PARAM);
  const formType: AuthFormType = isAuthFormType(rawFormType)
    ? rawFormType
    : AUTH_FORM_TYPES.login;

  const needsRedirect = !isAuthFormType(rawFormType);
  const canonicalPath = buildClientAuthUrl(formType);

  const requestedPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? CLIENT_DASHBOARD_HOME;

  if (needsRedirect) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (loading || (user && !profile && !isPasswordRecovery)) {
    return <CenteredLoading />;
  }

  const showResetPassword =
    isPasswordRecovery || formType === AUTH_FORM_TYPES.resetPassword;

  if (user && !showResetPassword) {
    return <Navigate to={requestedPath} replace />;
  }

  if (
    formType === AUTH_FORM_TYPES.resetPassword &&
    !isPasswordRecovery &&
    !user
  ) {
    return (
      <Navigate to={buildClientAuthUrl(AUTH_FORM_TYPES.forgotPassword)} replace />
    );
  }

  const switchFormPath = buildClientAuthUrl(
    formType === AUTH_FORM_TYPES.signup
      ? AUTH_FORM_TYPES.login
      : AUTH_FORM_TYPES.signup,
  );

  const title = showResetPassword
    ? "Choose a new password"
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "Reset password"
      : formType === AUTH_FORM_TYPES.signup
        ? "Create account"
        : "Sign in";

  const description = showResetPassword
    ? "Enter a new password for your client account."
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "We'll email you a link to choose a new password."
      : formType === AUTH_FORM_TYPES.signup
        ? "Use the same email your provider listed for you."
        : "Use the email on your client profile to continue.";

  const showSwitchLink =
    !showResetPassword && formType !== AUTH_FORM_TYPES.forgotPassword;

  return (
    <AuthShellLayout>
      <AuthFormCard
        title={title}
        description={description}
        footer={
          showSwitchLink ? (
            <p className="text-center text-sm text-muted-foreground">
              {formType === AUTH_FORM_TYPES.signup
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                to={switchFormPath}
                className="font-semibold text-primary hover:underline"
              >
                {formType === AUTH_FORM_TYPES.signup ? "Sign in" : "Sign up"}
              </Link>
            </p>
          ) : undefined
        }
      >
        {showResetPassword ? (
          <ResetPasswordForm redirectTo={CLIENT_DASHBOARD_HOME} />
        ) : formType === AUTH_FORM_TYPES.forgotPassword ? (
          <ForgotPasswordForm
            redirectPath={buildClientAuthUrl(AUTH_FORM_TYPES.resetPassword)}
            loginPath={buildClientAuthUrl(AUTH_FORM_TYPES.login)}
          />
        ) : formType === AUTH_FORM_TYPES.signup ? (
          <SignupForm emailRedirectPath={CLIENT_PORTAL_DASHBOARD_PATH} />
        ) : (
          <LoginForm oauthRedirectPath={CLIENT_PORTAL_DASHBOARD_PATH} />
        )}
      </AuthFormCard>
    </AuthShellLayout>
  );
}
