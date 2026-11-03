import { Link, useLocation } from "react-router";

import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { useForgotPasswordForm } from "@/shared/auth/hooks/useForgotPasswordForm";
import type { ForgotPasswordFormProps } from "@/shared/auth/types/components";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { AUTH_FORM_TYPES } from "@/shared/constants/auth";
import { buildAuthUrl } from "@/shared/utils/authUrlParams";

export function ForgotPasswordForm({ authPath }: ForgotPasswordFormProps) {
  const form = useForgotPasswordForm(authPath);
  const { state } = useLocation();
  const linkExpired = (state as { linkExpired?: boolean } | null)?.linkExpired === true;

  return (
    <div className="space-y-4">
      {linkExpired && !form.success ? (
        <AuthFormAlert
          variant="info"
          message="That reset link has expired or was already used. Request a new one below."
        />
      ) : null}
      <form onSubmit={(event) => void form.handleSubmit(event)} className="space-y-4">
        <TextField
          id="forgot-password-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={form.setEmail}
          disabled={form.isSubmitting}
          required
        />
        {form.error ? <AuthFormAlert message={form.error} variant="error" /> : null}
        {form.success ? <AuthFormAlert message={form.success} variant="success" /> : null}
        <SubmitButton loading={form.isSubmitting} className="w-full">
          Send reset link
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          to={buildAuthUrl(authPath, AUTH_FORM_TYPES.login)}
          className="text-foreground underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
