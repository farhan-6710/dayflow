import { useState } from "react";
import { Platform } from "react-native";

import { FormError } from "@/features/auth/FormError";
import { signInWithGoogle } from "@/services/authService";
import { Button } from "@/ui/Button";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (Platform.OS === "web") return null;

  async function start() {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    setLoading(false);
    if (!result.ok && !result.cancelled) {
      setError(result.message ?? "Couldn't sign in with Google. Try again.");
    }
  }

  return (
    <>
      <FormError message={error} />
      <Button label="Continue with Google" variant="outline" loading={loading} onPress={() => void start()} />
    </>
  );
}
