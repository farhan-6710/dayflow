import { useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router";

import { AuthShellLayout } from "@/shared/auth/components/AuthShellLayout";
import { ForgotPasswordForm } from "@/shared/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/shared/auth/components/LoginForm";
import { ResetPasswordForm } from "@/shared/auth/components/ResetPasswordForm";
import { SignupForm } from "@/shared/auth/components/SignupForm";
import type { AuthScreenProps } from "@/shared/auth/types/components";
import { AUTH_FORM_TYPE_PARAM, AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

/** Sign in, sign up, forgot and reset password, switched by the `form-type` query param. */
export function AuthScreen({ config }: AuthScreenProps) {
  const { user, isPasswordRecovery, clearPasswordRecovery } = useAuth();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get(AUTH_FORM_TYPE_PARAM);

  const isReset = isPasswordRecovery || formType === AUTH_FORM_TYPES.resetPassword;
  const isForgot = formType === AUTH_FORM_TYPES.forgotPassword;
  const isSignup = formType === AUTH_FORM_TYPES.signup;
  // The route guard has already waited for the session, so no user here means the link didn't work.
  const resetLinkInvalid = isReset && !user;

  useEffect(() => {
    if (resetLinkInvalid) {
      clearPasswordRecovery();
    }
  }, [resetLinkInvalid, clearPasswordRecovery]);

  if (resetLinkInvalid) {
    return (
      <Navigate
        to={buildAuthUrl(config.authPath, AUTH_FORM_TYPES.forgotPassword)}
        state={{ linkExpired: true }}
        replace
      />
    );
  }

  const [title, description] = isReset
    ? ["Choose a new password", config.resetDescription]
    : isForgot
      ? ["Reset your password", "We'll email you a link to choose a new one."]
      : isSignup
        ? ["Create your account", config.signUpDescription]
        : ["Sign in", config.signInDescription];

  return (
    <AuthShellLayout config={config}>
      <header className="mb-6">
        <h1 className="text-3xl leading-tight text-balance sm:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground text-pretty">{description}</p>
      </header>

      {isReset ? (
        <ResetPasswordForm homePath={config.homePath} />
      ) : isForgot ? (
        <ForgotPasswordForm authPath={config.authPath} />
      ) : isSignup ? (
        <SignupForm homePath={config.homePath} />
      ) : (
        <LoginForm authPath={config.authPath} homePath={config.homePath} showDemoLogin={config.showDemoLogin} />
      )}

      {isReset || isForgot ? null : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <Link
            to={buildAuthUrl(config.authPath, isSignup ? AUTH_FORM_TYPES.login : AUTH_FORM_TYPES.signup)}
            className="text-foreground underline underline-offset-4"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      )}
    </AuthShellLayout>
  );
}
