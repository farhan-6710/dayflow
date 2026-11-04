import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { useTheme } from "@/theme/ThemeProvider";

export default function ClientLayout() {
  const { user, loading, portal, client, clientLoading } = useAuth();
  const { colors } = useTheme();

  if (loading || clientLoading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (portal !== "client" || !client) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
