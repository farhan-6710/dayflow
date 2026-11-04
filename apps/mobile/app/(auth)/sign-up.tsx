import { useRouter } from "expo-router";
import { Lock, Mail, MailCheck, User } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { useAuth } from "@/features/auth/AuthProvider";
import { AuthShell } from "@/features/auth/AuthShell";
import { FormError } from "@/features/auth/FormError";
import { GoogleButton } from "@/features/auth/GoogleButton";
import { MIN_PASSWORD_LENGTH, isValidEmail } from "@/features/auth/validation";
import { signUpWithEmail } from "@/services/authService";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Text } from "@/ui/Text";

export default function SignUpScreen() {
  const router = useRouter();
  const { portal } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) return setError("Enter your name.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (password.length < MIN_PASSWORD_LENGTH) return setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);

    setSaving(true);
    setError(null);
    const result = await signUpWithEmail(email.trim(), password, name.trim());
    setSaving(false);
    if (!result.ok) return setError(result.error.message);
    if (result.requiresEmailConfirmation) setSentTo(email.trim());
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" description={`We sent a confirmation link to ${sentTo}. Open it on this phone to finish signing up.`}>
        <View className="items-center py-6">
          <MailCheck size={48} color={colors["chart-1"]} />
        </View>
        <Button label="Back to sign in" variant="outline" onPress={() => router.replace("/sign-in")} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      description={portal === "client" ? "Use the email your freelancer has on file, so your projects appear." : "Start organizing your clients and your day."}
    >
      <FormError message={error} />
      <Input label="Full name" icon={User} value={name} onChangeText={setName} autoComplete="name" textContentType="name" returnKeyType="next" placeholder="Your name" />
      <Input
        label="Email"
        icon={Mail}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        icon={Lock}
        password
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
        placeholder="Choose a password"
      />
      <Button label="Create account" onPress={() => void submit()} loading={saving} />
      <GoogleButton />
      <View className="flex-row items-center justify-center gap-1.5 pt-2">
        <Text tone="muted">Already have an account?</Text>
        <Text onPress={() => router.replace("/sign-in")} accessibilityRole="link" className="underline">
          Sign in
        </Text>
      </View>
    </AuthShell>
  );
}
