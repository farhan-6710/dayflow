import { useRouter } from "expo-router";
import { Mail, MailCheck } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { AuthShell } from "@/features/auth/AuthShell";
import { FormError } from "@/features/auth/FormError";
import { isValidEmail } from "@/features/auth/validation";
import { requestPasswordReset } from "@/services/authService";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    setSaving(true);
    setError(null);
    const failure = await requestPasswordReset(email);
    setSaving(false);
    if (failure) return setError(failure.message);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell title="Check your inbox" description={`If ${email.trim()} has an account, a reset link is on its way. Open it on this phone.`}>
        <View className="items-center py-6">
          <MailCheck size={48} color={colors["chart-1"]} />
        </View>
        <Button label="Back to sign in" variant="outline" onPress={() => router.back()} />
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" description="We'll email you a link to choose a new one.">
      <FormError message={error} />
      <Input
        label="Email"
        icon={Mail}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={() => void submit()}
        placeholder="you@example.com"
      />
      <Button label="Send reset link" onPress={() => void submit()} loading={saving} />
    </AuthShell>
  );
}
