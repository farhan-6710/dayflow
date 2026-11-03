import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { useProfileForm } from "@/shared/settings/hooks/useProfileForm";
import { getInitials } from "@/shared/utils/authUserDisplay";

export function ProfileCard() {
  const form = useProfileForm();
  const { displayName, avatarUrl } = useUserDisplay();

  return (
    <SettingsCard title="Profile" description="How your name and picture appear across DayFlow.">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={form.avatarUrl.trim() || avatarUrl}
            initials={getInitials(form.displayName.trim() || displayName)}
            alt=""
            className="size-14 text-base"
          />
          <p className="min-w-0 truncate text-lg">{form.displayName.trim() || displayName}</p>
        </div>
        <TextField
          id="settings-display-name"
          label="Display name"
          autoComplete="name"
          value={form.displayName}
          onChange={form.setDisplayName}
          disabled={form.saving}
          required
        />
        <TextField
          id="settings-avatar-url"
          label="Avatar URL (optional)"
          type="url"
          placeholder="https://example.com/avatar.png"
          value={form.avatarUrl}
          onChange={form.setAvatarUrl}
          disabled={form.saving}
        />
        <SubmitButton loading={form.saving} disabled={!form.isDirty}>
          Save profile
        </SubmitButton>
      </form>
    </SettingsCard>
  );
}
