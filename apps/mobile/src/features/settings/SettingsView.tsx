import { useQueryClient } from "@tanstack/react-query";
import { CircleHelp, LogOut, Lock, Mail, User } from "lucide-react-native";
import { useEffect, useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Linking, Platform, ScrollView, View } from "react-native";

import { useAuth, type Portal } from "@/features/auth/AuthProvider";
import { MIN_PASSWORD_LENGTH, isValidEmail } from "@/features/auth/validation";
import { getReminderAlertsEnabled, setReminderAlertsEnabled } from "@/features/settings/notificationPrefs";
import { useSignOut } from "@/features/settings/useSignOut";
import { syncReminderAlertsSetting } from "@/features/reminders/notificationPort";
import { errorMessage } from "@/lib/query";
import { useUnsavedGuard } from "@/lib/useUnsavedGuard";
import { requestPasswordReset, updateAuthDisplayName, updateEmail, updatePassword } from "@/services/authService";
import { updateProfile } from "@/services/profilesService";
import { SUPPORT_URL } from "@/shared/constants/support";
import { userHasPasswordLogin } from "@/shared/utils/authUserDisplay";
import { useTheme, type ThemeMode } from "@/theme/ThemeProvider";
import { Avatar } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { MenuRow } from "@/ui/MenuRow";
import { BackHeader, Screen } from "@/ui/Screen";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { SwitchRow } from "@/ui/SwitchRow";
import { Text } from "@/ui/Text";
import { showToast } from "@/ui/Toaster";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="gap-3">
      <View>
        <Text variant="heading" accessibilityRole="header">
          {title}
        </Text>
        {description ? (
          <Text variant="label" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      {children}
    </Card>
  );
}

export function SettingsView({ portal }: { portal: Portal }) {
  const { user, profile, displayName, initials, avatarUrl } = useAuth();
  const { mode, setMode } = useTheme();
  const signOut = useSignOut();
  const client = useQueryClient();

  const savedName = profile?.display_name ?? displayName;
  const savedAvatar = profile?.avatar_url ?? "";
  const [name, setName] = useState(savedName);
  const [avatar, setAvatar] = useState(savedAvatar);
  const [savingProfile, setSavingProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [reminderAlerts, setReminderAlerts] = useState(true);

  useEffect(() => {
    setName(savedName);
    setAvatar(savedAvatar);
  }, [savedName, savedAvatar]);

  useEffect(() => {
    void getReminderAlertsEnabled().then(setReminderAlerts);
  }, []);

  const profileDirty = name.trim() !== savedName.trim() || avatar.trim() !== savedAvatar.trim();
  useUnsavedGuard(profileDirty || Boolean(email.trim()) || Boolean(password));
  const hasPassword = userHasPasswordLogin(user);
  const emailValid = isValidEmail(email) && email.trim().toLowerCase() !== user?.email?.toLowerCase();

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user.id, { display_name: name.trim(), avatar_url: avatar.trim() || null });
      const failure = await updateAuthDisplayName(name);
      if (failure) throw failure;
      await client.invalidateQueries({ queryKey: ["profile"] });
      showToast("success", "Profile saved.");
    } catch (error) {
      showToast("error", errorMessage(error, "Couldn't save your profile."));
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveEmail() {
    setSavingEmail(true);
    const failure = await updateEmail(email);
    setSavingEmail(false);
    if (failure) return showToast("error", failure.message);
    setEmail("");
    showToast("success", "Check your inbox to confirm the change.");
  }

  async function savePassword() {
    setSavingPassword(true);
    const failure = await updatePassword(password);
    setSavingPassword(false);
    if (failure) return showToast("error", failure.message);
    setPassword("");
    showToast("success", "Password updated.");
  }

  async function sendReset() {
    if (!user?.email) return;
    setSendingReset(true);
    const failure = await requestPasswordReset(user.email);
    setSendingReset(false);
    showToast(failure ? "error" : "success", failure ? failure.message : "Reset link sent to your email.");
  }

  async function toggleAlerts(enabled: boolean) {
    setReminderAlerts(enabled);
    await setReminderAlertsEnabled(enabled);
    await syncReminderAlertsSetting();
    showToast("success", enabled ? "Reminder alerts on." : "Reminder alerts off.");
  }

  return (
    <Screen>
      <BackHeader title="Settings" />
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
          <Section title="Profile" description="How your name and picture appear across DayFlow.">
            <View className="flex-row items-center gap-3">
              <Avatar uri={avatarUrl} initials={initials} size={52} />
              <Text variant="subheading" className="flex-1" numberOfLines={1}>
                {displayName}
              </Text>
            </View>
            <Input label="Display name" icon={User} value={name} onChangeText={setName} autoComplete="name" />
            <Input label="Avatar URL (optional)" value={avatar} onChangeText={setAvatar} autoCapitalize="none" keyboardType="url" placeholder="https://example.com/avatar.png" />
            <Button label="Save profile" loading={savingProfile} disabled={!profileDirty || !name.trim()} onPress={() => void saveProfile()} />
          </Section>

          <Section title="Appearance" description="Follows your device until you choose. Remembered on this device.">
            <SegmentedTabs tabs={THEME_OPTIONS} value={mode} onChange={setMode} />
          </Section>

          {portal === "workspace" ? (
            <Section title="Notifications" description="Saved on this device.">
              <SwitchRow label="Reminder alerts" description="Sound and notification when a reminder is due." value={reminderAlerts} onChange={(value) => void toggleAlerts(value)} />
              {Platform.OS === "web" ? null : <Button label="Open system notification settings" variant="ghost" size="sm" onPress={() => void Linking.openSettings()} />}
            </Section>
          ) : null}

          <Section title="Email" description={`You sign in with ${user?.email ?? "your email"}.`}>
            {user?.new_email ? (
              <Text variant="label" tone="muted">{`Waiting for you to confirm ${user.new_email} from your inbox.`}</Text>
            ) : null}
            <Input label="New email" icon={Mail} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="you@example.com" />
            <Button label="Change email" variant="outline" loading={savingEmail} disabled={!emailValid} onPress={() => void saveEmail()} />
          </Section>

          <Section title="Password" description={hasPassword ? "Choose a new password, or get a reset link by email." : "You signed in with Google. Set a password to also sign in with email."}>
            <Input label={hasPassword ? "New password" : "Password"} icon={Lock} password value={password} onChangeText={setPassword} autoCapitalize="none" autoComplete="new-password" hint={`At least ${MIN_PASSWORD_LENGTH} characters`} />
            <Button label={hasPassword ? "Update password" : "Set password"} variant="outline" loading={savingPassword} disabled={password.length < MIN_PASSWORD_LENGTH} onPress={() => void savePassword()} />
            {hasPassword ? <Button label="Email me a reset link" variant="ghost" size="sm" loading={sendingReset} onPress={() => void sendReset()} /> : null}
          </Section>

          <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <MenuRow first icon={CircleHelp} label="Help & support" onPress={() => void Linking.openURL(SUPPORT_URL)} />
            <MenuRow icon={LogOut} label="Log out" destructive onPress={() => void signOut()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
