import { useSettings } from "@/features/workspace/settings/hooks/useSettings";
import { FluidWaveItem } from "@/shared/components/FluidWaveItem";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  ACCOUNT_RESET_PASSWORD_HINT,
  ACCOUNT_SET_PASSWORD_HINT,
} from "@/shared/constants/accountPassword";
import {
  formFieldGroupClassName,
  formLabelClassName,
} from "@/shared/constants/formStyles";
import {
  insetChipClassName,
  raisedStaticPanelClassName,
} from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Sun, Moon, KeyRound, User, Palette, Mail } from "lucide-react";

export function SettingsPage() {
  const {
    user,
    hasPasswordLogin,
    currentEmail,
    displayName,
    setDisplayName,
    avatarUrl,
    setAvatarUrl,
    newEmail,
    setNewEmail,
    pendingEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    savingProfile,
    updatingEmail,
    emailChangeConfirmOpen,
    setEmailChangeConfirmOpen,
    sendingResetLink,
    settingPassword,
    isDarkMode,
    handleUpdateProfile,
    handleUpdateTheme,
    openEmailChangeConfirm,
    handleConfirmEmailChange,
    handleRequestPasswordReset,
    handleSetPassword,
  } = useSettings();

  const canChangeEmail =
    newEmail.trim().length > 0 &&
    newEmail.trim().toLowerCase() !== currentEmail.toLowerCase();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preferences"
        heading="Settings"
        description="Configure your personal preferences, theme appearance, and security credentials."
      />

      <PageContent stagger={false}>
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-5">
            <FluidWaveItem index={0} className={cn("px-5 pt-5 pb-5", raisedStaticPanelClassName)}>
              <div className="mb-5 flex items-center gap-2.5">
                <User className="size-5 text-primary-text" />
                <h3 className="text-2xl leading-none font-bold">
                  Profile Information
                </h3>
              </div>

              <form
                onSubmit={(e) => void handleUpdateProfile(e)}
                className="space-y-4"
              >
                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>Display Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={savingProfile}
                  />
                </div>

                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>
                    Avatar URL (Optional)
                  </label>
                  <Input
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={savingProfile}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full"
                >
                  Save Profile Details
                </Button>
              </form>
            </FluidWaveItem>

            <FluidWaveItem index={2} className={cn("px-5 pt-5 pb-5", raisedStaticPanelClassName)}>
              <div className="mb-5 flex items-center gap-2.5">
                <Mail className="size-5 text-primary-text" />
                <h3 className="text-2xl leading-none font-bold">
                  Change Email
                </h3>
              </div>

              <form onSubmit={openEmailChangeConfirm} className="space-y-4">
                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>Current email</label>
                  <Input
                    type="email"
                    value={currentEmail}
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                </div>

                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>New email</label>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="new@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    disabled={updatingEmail}
                  />
                </div>

                {pendingEmail ? (
                  <p className="surface-chip rounded-[0.8rem] px-3 py-2 text-xs text-muted-foreground">
                    Pending change to{" "}
                    <span className="font-medium text-foreground">
                      {pendingEmail}
                    </span>
                    — finish confirming both inbox links to complete it.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={updatingEmail || !canChangeEmail}
                  className="w-full"
                  variant="outline"
                >
                  Change email
                </Button>
              </form>
            </FluidWaveItem>

            <FluidWaveItem index={4} className={cn("px-5 pt-5 pb-5", raisedStaticPanelClassName)}>
              <div className="mb-5 flex items-center gap-2.5">
                <Palette className="size-5 text-primary-text" />
                <h3 className="text-2xl leading-none font-bold">
                  Workspace Appearance
                </h3>
              </div>

              <div className="surface-chip flex items-center justify-between gap-4 rounded-[0.8rem] px-4 py-3">
                <div>
                  <h4 className="font-sans text-sm font-semibold">Dark Mode Option</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Toggle light/dark appearance for your workspace.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sun className="size-4" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={(checked) =>
                      void handleUpdateTheme(checked)
                    }
                    className="cursor-pointer"
                  />
                  <Moon className="size-4" />
                </div>
              </div>
            </FluidWaveItem>
          </div>

          <div className="space-y-5">
            <FluidWaveItem index={1} className={cn("px-5 pt-5 pb-5", raisedStaticPanelClassName)}>
              <div className="mb-5 flex items-center gap-2.5">
                <KeyRound className="size-5 text-primary-text" />
                <h3 className="text-2xl leading-none font-bold">
                  {hasPasswordLogin ? "Reset Password" : "Set Password"}
                </h3>
              </div>

              {hasPasswordLogin ? (
                <form
                  onSubmit={(e) => void handleRequestPasswordReset(e)}
                  className="space-y-4"
                >
                  <div className={formFieldGroupClassName}>
                    <label className={formLabelClassName}>Account email</label>
                    <Input
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      className="bg-muted text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                      {ACCOUNT_RESET_PASSWORD_HINT}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={sendingResetLink || !user?.email}
                    className="w-full"
                    variant="outline"
                  >
                    {sendingResetLink
                      ? "Sending link…"
                      : "Send password reset link"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => void handleSetPassword(e)}
                  className="space-y-4"
                >
                  <div className={formFieldGroupClassName}>
                    <label className={formLabelClassName}>New password</label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={`At least ${ACCOUNT_PASSWORD_MIN_LENGTH} characters`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={settingPassword}
                    />
                  </div>

                  <div className={formFieldGroupClassName}>
                    <label className={formLabelClassName}>
                      Confirm password
                    </label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={settingPassword}
                    />
                    <p className="text-xs text-muted-foreground">
                      {ACCOUNT_SET_PASSWORD_HINT}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      settingPassword ||
                      !password.trim() ||
                      !confirmPassword.trim()
                    }
                    className="w-full"
                    variant="outline"
                  >
                    {settingPassword ? "Saving…" : "Set password"}
                  </Button>
                </form>
              )}
            </FluidWaveItem>

            <FluidWaveItem index={3} className={cn("px-5 pt-5 pb-5", raisedStaticPanelClassName)}>
              <h3 className="text-2xl leading-none font-bold">
                DayFlow Environment
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                This is a private personal command center. Your data is
                protected by Row Level Security (RLS) policies inside Supabase,
                and authenticated sessions are maintained securely in your
                browser cache.
              </p>
              <div className={cn(
                  "mt-4 p-3 text-xs font-semibold leading-relaxed text-secondary-foreground",
                  insetChipClassName,
                )}>
                Connection Status: Secured (Supabase SSL)
              </div>
            </FluidWaveItem>
          </div>
        </div>
      </PageContent>

      <ConfirmationModal
        open={emailChangeConfirmOpen}
        onOpenChange={setEmailChangeConfirmOpen}
        title="Change email?"
        description={`We'll send verification links to ${currentEmail || "your current inbox"} and ${newEmail.trim().toLowerCase()}. Your login email updates only after you confirm both links. Until then, keep signing in with your current address.`}
        confirmLabel="Send verification links"
        cancelLabel="Cancel"
        loading={updatingEmail}
        onConfirm={handleConfirmEmailChange}
      />
    </div>
  );
}
export default SettingsPage;
