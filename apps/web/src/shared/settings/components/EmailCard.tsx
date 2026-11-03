import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { useEmailForm } from "@/shared/settings/hooks/useEmailForm";
import type { EmailCardProps } from "@/shared/settings/types/components";

export function EmailCard({ settingsPath }: EmailCardProps) {
  const form = useEmailForm(settingsPath);

  return (
    <SettingsCard title="Email" description="The address you sign in with.">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <TextField id="settings-current-email" label="Current email" type="email" value={form.currentEmail} disabled readOnly />
        <TextField
          id="settings-new-email"
          label="New email"
          type="email"
          autoComplete="email"
          placeholder="new@example.com"
          value={form.newEmail}
          onChange={form.setNewEmail}
          disabled={form.saving}
          required
        />
        {form.pendingEmail ? (
          <p role="status" className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-pretty">
            Change to {form.pendingEmail} is pending. Confirm the links in both inboxes to finish it.
          </p>
        ) : null}
        <SubmitButton variant="outline" loading={form.saving} disabled={!form.canSubmit}>
          Change email
        </SubmitButton>
      </form>
      <ConfirmationModal
        open={form.confirmOpen}
        onOpenChange={form.setConfirmOpen}
        title="Change your email?"
        description={`We'll send verification links to ${form.currentEmail} and ${form.nextEmail}. Your login email changes only after you confirm both. Until then, keep signing in with your current address.`}
        confirmLabel="Send verification links"
        loading={form.saving}
        onConfirm={form.confirm}
      />
    </SettingsCard>
  );
}
