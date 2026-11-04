import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { useTheme } from "@/theme/ThemeProvider";
import { PushRegistration } from "@/features/reminders/PushRegistration";
import { ReminderSync } from "@/features/reminders/ReminderSync";
import { Platform } from "react-native";

export default function OwnerLayout() {
  const { user, loading, portal } = useAuth();
  const { colors } = useTheme();

  if (loading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (portal !== "workspace") return <Redirect href="/" />;

  return (
    <>
      {Platform.OS === "web" ? null : (
        <>
          <PushRegistration />
          <ReminderSync />
        </>
      )}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </>
  );
}
