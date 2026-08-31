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
import { buildAuthUrl } from "@/features/workspace/auth/utils/authUrlParams";
import { DASHBOARD_HOME } from "@/features/workspace/auth/constants/routes";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

function isAuthFormType(value: string | null): value is AuthFormType {
  return (
    value !== null &&
    (AUTH_FORM_TYPE_VALUES as readonly string[]).includes(value)
  );
}

export function AuthPage() {
  const {
    user,
    loading,
    profile,
    isPasswordRecovery,
  } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawFormType = searchParams.get(AUTH_FORM_TYPE_PARAM);
  const formType: AuthFormType = isAuthFormType(rawFormType)
    ? rawFormType
    : AUTH_FORM_TYPES.login;

  const needsRedirect = !isAuthFormType(rawFormType);
  const canonicalPath = buildAuthUrl(formType);

  const requestedPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? DASHBOARD_HOME;

  if (needsRedirect) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (loading || (user && !profile && !isPasswordRecovery)) {
    return <CenteredLoading />;
  }

  const showResetPassword =
    isPasswordRecovery || formType === AUTH_FORM_TYPES.resetPassword;

  // Recovery session must stay on this page to set a new password.
  if (user && !showResetPassword) {
    return <Navigate to={requestedPath} replace />;
  }

  // Reset link without an active recovery session — send them to forgot-password.
  if (
    formType === AUTH_FORM_TYPES.resetPassword &&
    !isPasswordRecovery &&
    !user
  ) {
    return <Navigate to={buildAuthUrl(AUTH_FORM_TYPES.forgotPassword)} replace />;
  }

  const switchFormPath = buildAuthUrl(
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
    ? "Enter a new password for your DayFlow account."
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "We'll email you a link to choose a new password."
      : formType === AUTH_FORM_TYPES.signup
        ? "Add your name, email, and a password to get started."
        : "Use your email and password to access your workspace.";

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
          <ResetPasswordForm />
        ) : formType === AUTH_FORM_TYPES.forgotPassword ? (
          <ForgotPasswordForm />
        ) : formType === AUTH_FORM_TYPES.signup ? (
          <SignupForm />
        ) : (
          <LoginForm />
        )}
      </AuthFormCard>
    </AuthShellLayout>
  );
}
