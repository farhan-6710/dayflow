import { Link, useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { useAuth } from "@/features/auth/AuthProvider";
import { AuthShell } from "@/features/auth/AuthShell";
import { DEMO_ACCOUNT } from "@/features/auth/demoAccount";
import { FormError } from "@/features/auth/FormError";
import { GoogleButton } from "@/features/auth/GoogleButton";
import { isValidEmail } from "@/features/auth/validation";
import { signInWithEmail } from "@/services/authService";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Text } from "@/ui/Text";

export default function SignInScreen() {
  const router = useRouter();
  const { portal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"form" | "demo" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isClient = portal === "client";

  async function submit(address: string, secret: string, source: "form" | "demo") {
    setBusy(source);
    setError(null);
    const failure = await signInWithEmail(address.trim(), secret);
    // On success the auth layout redirects, so stay busy until then.
    if (failure) {
      setBusy(null);
      setError(failure.message);
    }
  }

  function signIn() {
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    void submit(email, password, "form");
  }

  return (
    <AuthShell
      title="Welcome back"
      description={isClient ? "Sign in with the email your freelancer has on file." : "Sign in to your workspace."}
      art={isClient ? "authClient" : undefined}
    >
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
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={signIn}
        placeholder="Your password"
      />
      <Link href="/forgot-password" className="self-end font-sans text-sm text-muted-foreground underline">
        Forgot password?
      </Link>
      <Button label="Sign in" onPress={signIn} loading={busy === "form"} disabled={busy !== null} />
      <GoogleButton />
      {isClient ? null : (
        <Button
          label="Continue with demo account"
          variant="success"
          loading={busy === "demo"}
          disabled={busy !== null}
          onPress={() => void submit(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password, "demo")}
        />
      )}
      <View className="flex-row items-center justify-center gap-1.5 pt-2">
        <Text tone="muted">New to DayFlow?</Text>
        <Text onPress={() => router.push("/sign-up")} accessibilityRole="link" className="underline">
          Create an account
        </Text>
      </View>
    </AuthShell>
  );
}
