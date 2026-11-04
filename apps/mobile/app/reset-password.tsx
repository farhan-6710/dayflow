import { Redirect, useRouter } from "expo-router";
import { Lock } from "lucide-react-native";
import { useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";
import { AuthShell } from "@/features/auth/AuthShell";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { FormError } from "@/features/auth/FormError";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/validation";
import { updatePassword } from "@/services/authService";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { showToast } from "@/ui/Toaster";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;

  async function submit() {
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    setSaving(true);
    setError(null);
    const failure = await updatePassword(password);
    setSaving(false);
    if (failure) return setError(failure.message);
    showToast("success", "Password updated.");
    router.replace("/");
  }

  return (
    <AuthShell title="Choose a new password" back={false}>
      <FormError message={error} />
      <Input
        label="New password"
        icon={Lock}
        password
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
      />
      <Button label="Save password" onPress={() => void submit()} loading={saving} />
    </AuthShell>
  );
}
