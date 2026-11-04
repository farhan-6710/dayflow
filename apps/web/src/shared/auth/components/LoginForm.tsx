import { Link } from "react-router";

import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { AuthOAuthSignIn } from "@/shared/auth/components/AuthOAuthSignIn";
import { DemoLoginButton } from "@/shared/auth/components/DemoLoginButton";
import { useLoginForm } from "@/shared/auth/hooks/useLoginForm";
import type { LoginFormProps } from "@/shared/auth/types/components";
import { PasswordField } from "@/shared/components/PasswordField";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

export function LoginForm({ authPath, homePath, showDemoLogin }: LoginFormProps) {
  const form = useLoginForm();

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={form.setEmail}
          disabled={form.isSubmitting}
          required
        />
        <div className="space-y-1.5">
          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={form.setPassword}
            disabled={form.isSubmitting}
          />
          <Link
            to={buildAuthUrl(authPath, AUTH_FORM_TYPES.forgotPassword)}
            className="inline-block py-1 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>
        {form.error ? <AuthFormAlert message={form.error} variant="error" /> : null}
        <SubmitButton loading={form.isSubmitting} className="w-full">
          Sign in
        </SubmitButton>
      </form>

      <AuthOAuthSignIn
        disabled={form.isSubmitting}
        redirectPath={homePath}
        onError={form.setError}
        onBeforeSignIn={() => form.setError(null)}
      />
      {showDemoLogin ? <DemoLoginButton label="Continue with demo account" /> : null}
    </div>
  );
}
