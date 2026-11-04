import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/features/auth/AuthProvider";
import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { useTheme } from "@/theme/ThemeProvider";

export default function OwnerLayout() {
  const { user, loading, portal } = useAuth();
  const { colors } = useTheme();

  if (loading) return <CenteredSpinner />;
  if (!user) return <Redirect href="/welcome" />;
  if (portal !== "workspace") return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
