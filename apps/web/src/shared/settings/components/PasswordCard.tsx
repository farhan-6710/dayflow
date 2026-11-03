import { PasswordField } from "@/shared/components/PasswordField";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { MIN_PASSWORD_LENGTH } from "@/shared/constants/auth";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { usePasswordForm } from "@/shared/settings/hooks/usePasswordForm";
import type { PasswordCardProps } from "@/shared/settings/types/components";

export function PasswordCard({ authPath }: PasswordCardProps) {
  const form = usePasswordForm(authPath);

  if (form.hasPasswordLogin) {
    return (
      <SettingsCard
        title="Password"
        description={`We'll email ${form.email} a secure link to choose a new password. Your current one keeps working until you finish.`}
      >
        <form onSubmit={(event) => void form.sendResetLink(event)}>
          <SubmitButton variant="outline" loading={form.saving} disabled={!form.email}>
            Send reset link
          </SubmitButton>
        </form>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard
      title="Set a password"
      description="Add a password so you can also sign in with your email, alongside Google."
    >
      <form onSubmit={form.handleSetPassword} className="space-y-4">
        <PasswordField
          id="settings-new-password"
          label="New password"
          autoComplete="new-password"
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          value={form.password}
          onChange={form.setPassword}
          disabled={form.saving}
        />
        <PasswordField
          id="settings-confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={form.setConfirm}
          disabled={form.saving}
        />
        <SubmitButton variant="outline" loading={form.saving} disabled={!form.password || !form.confirm}>
          Set password
        </SubmitButton>
      </form>
    </SettingsCard>
  );
}
