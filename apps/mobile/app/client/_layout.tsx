import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { useTheme } from "@/theme/ThemeProvider";
import { PushRegistration } from "@/features/reminders/PushRegistration";
import { Platform } from "react-native";

export default function ClientLayout() {
  const { user, loading, portal, client, clientLoading } = useAuth();
  const { colors } = useTheme();

  if (loading || clientLoading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (portal !== "client" || !client) return <Redirect href="/" />;

  return (
    <>
      {Platform.OS === "web" ? null : (
        <>
          <PushRegistration />
        </>
      )}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </>
  );
}
