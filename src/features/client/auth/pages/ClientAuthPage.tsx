import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { ForgotPasswordForm } from "@/features/admin/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/features/admin/auth/components/LoginForm";
import { ResetPasswordForm } from "@/features/admin/auth/components/ResetPasswordForm";
import { SignupForm } from "@/features/admin/auth/components/SignupForm";
import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPE_VALUES,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/admin/auth/constants/auth";
import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { buildClientAuthUrl } from "@/features/client/auth/utils/clientAuthUrlParams";
import {
  CLIENT_AUTH_HOME,
  CLIENT_DASHBOARD_HOME,
} from "@/features/client/constants/routes";
import { ADMIN_PORTAL_AUTH_PATH } from "@/app/constants/adminPortalRoutes";
import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
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
        : "Log in";

  const description = showResetPassword
    ? "Enter a new password for your DayFlow client account."
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "We’ll email you a link to choose a new password."
      : formType === AUTH_FORM_TYPES.signup
        ? "Create your client portal account."
        : "Sign in to the DayFlow client portal.";

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 flex flex-col items-center">
          <Link to={CLIENT_AUTH_HOME} className="transition-opacity hover:opacity-90">
            <DayFlowLogo variant="full" imageClassName="h-10 max-w-[12rem]" />
          </Link>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Client Portal
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

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

          {!showResetPassword && formType !== AUTH_FORM_TYPES.forgotPassword ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {formType === AUTH_FORM_TYPES.signup
                ? "Already have an account?"
                : "Need an account?"}{" "}
              <Link
                to={switchFormPath}
                className="font-semibold text-primary hover:underline"
              >
                {formType === AUTH_FORM_TYPES.signup ? "Log in" : "Sign up"}
              </Link>
            </p>
          ) : null}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Admin user?{" "}
            <Link
              to={ADMIN_PORTAL_AUTH_PATH}
              className="font-semibold text-primary hover:underline"
            >
              Go to admin portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
