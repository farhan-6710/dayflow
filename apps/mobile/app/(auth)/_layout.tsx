import { Redirect, Stack } from "expo-router";

import { CenteredSpinner } from "@/features/auth/CenteredSpinner";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/theme/ThemeProvider";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) return <CenteredSpinner />;
  if (user) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
