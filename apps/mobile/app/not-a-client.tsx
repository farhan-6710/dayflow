import { Redirect } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { illustrations } from "@/theme/images";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Text } from "@/ui/Text";
import { showToast } from "@/ui/Toaster";

export default function NotAClientScreen() {
  const insets = useSafeAreaInsets();
  const { scheme } = useTheme();
  const { user, loading, client, clientLoading, recheckClient, signOut, setPortal } = useAuth();
  const [leaving, setLeaving] = useState(false);

  if (loading || clientLoading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (client) return <Redirect href="/" />;

  async function leave() {
    setLeaving(true);
    try {
      await signOut();
      setPortal("workspace");
    } catch {
      setLeaving(false);
      showToast("error", "Couldn't sign out. Check your connection and try again.");
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", gap: 12, paddingHorizontal: 24, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <Image source={illustrations.notAClient[scheme]} accessibilityIgnoresInvertColors resizeMode="contain" style={{ width: "100%", height: 208 }} />
      <Text variant="title" accessibilityRole="header" className="text-center">
        We can't find your projects
      </Text>
      <Text tone="muted" className="text-center">
        {`${user.email ?? "This email"} isn't linked to a client yet. Ask your freelancer to add this exact email to your client record, then try again.`}
      </Text>
      <View className="mt-4 gap-3">
        <Button label="Try again" onPress={recheckClient} />
        <Button label="Sign out" variant="outline" loading={leaving} onPress={() => void leave()} />
      </View>
    </ScrollView>
  );
}
