import { useSettings } from "@/features/settings/hooks/useSettings";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Sun, Moon, KeyRound, User, Palette } from "lucide-react";

export function SettingsPage() {
  const {
    user,
    displayName,
    setDisplayName,
    avatarUrl,
    setAvatarUrl,
    password,
    setPassword,
    savingProfile,
    updatingPassword,
    isDarkMode,
    handleUpdateProfile,
    handleUpdateTheme,
    handleUpdatePassword,
  } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Settings"
        description="Configure your personal preferences, theme appearance, and security credentials."
      />

      <PageContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
          {/* Section 1: Profile Details & Appearance */}
          <div className="space-y-6">
            {/* Profile Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
                <User className="size-5 text-primary" />
                <h3 className="font-semibold text-sm tracking-tight text-foreground">Profile Information</h3>
              </div>

              <form onSubmit={(e) => void handleUpdateProfile(e)} className="space-y-4">
                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>
                    Display Name
                  </label>
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

                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>
                    Email Address
                  </label>
                  <Input value={user?.email || ""} disabled className="bg-muted text-muted-foreground" />
                  <p className="text-3xs text-muted-foreground">Contact support if you need to change your email.</p>
                </div>

                <Button type="submit" disabled={savingProfile} className="w-full">
                  Save Profile Details
                </Button>
              </form>
            </div>

            {/* Theme / Appearance Preferences */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
                <Palette className="size-5 text-primary" />
                <h3 className="font-semibold text-sm tracking-tight text-foreground">Workspace Appearance</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Dark Mode Option</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle light/dark appearance for your workspace.</p>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sun className="size-4" />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={(checked) => void handleUpdateTheme(checked)}
                    className="cursor-pointer"
                  />
                  <Moon className="size-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account Security */}
          <div className="space-y-6">
            {/* Password Update Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
                <KeyRound className="size-5 text-primary" />
                <h3 className="font-semibold text-sm tracking-tight text-foreground">Update Password</h3>
              </div>

              <form onSubmit={(e) => void handleUpdatePassword(e)} className="space-y-4">
                <div className={formFieldGroupClassName}>
                  <label className={formLabelClassName}>
                    New Hashed Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Min 6 characters required"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={updatingPassword}
                  />
                </div>

                <Button type="submit" disabled={updatingPassword || !password.trim()} className="w-full" variant="outline">
                  Update Password Credentials
                </Button>
              </form>
            </div>

            {/* Workspace details info */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xs">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">DayFlow Environment</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                This is a private personal command center. Your data is protected by Row Level Security (RLS) policies inside Supabase, and authenticated sessions are maintained securely in your browser cache.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-secondary text-secondary-foreground text-3xs font-semibold leading-relaxed border border-border/80">
                Connection Status: Secured (Supabase SSL)
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
export default SettingsPage;
