import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { useResetPasswordForm } from "@/shared/auth/hooks/useResetPasswordForm";
import type { ResetPasswordFormProps } from "@/shared/auth/types/components";
import { PasswordField } from "@/shared/components/PasswordField";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";

export function ResetPasswordForm({ homePath }: ResetPasswordFormProps) {
  const form = useResetPasswordForm(homePath);

  return (
    <form onSubmit={(event) => void form.handleSubmit(event)} className="space-y-4">
      <PasswordField
        id="reset-password"
        label="New password"
        autoComplete="new-password"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        value={form.password}
        onChange={form.setPassword}
        disabled={form.isSubmitting}
      />
      <PasswordField
        id="reset-password-confirm"
        label="Confirm password"
        autoComplete="new-password"
        value={form.confirm}
        onChange={form.setConfirm}
        disabled={form.isSubmitting}
      />
      {form.error ? <AuthFormAlert message={form.error} variant="error" /> : null}
      <SubmitButton loading={form.isSubmitting} className="w-full">
        Update password
      </SubmitButton>
    </form>
  );
}
