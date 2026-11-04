import { Merriweather_400Regular, Merriweather_700Bold } from "@expo-google-fonts/merriweather";
import { Ovo_400Regular } from "@expo-google-fonts/ovo";
import { YoungSerif_400Regular } from "@expo-google-fonts/young-serif";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/theme/global.css";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { queryClient } from "@/lib/query";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { Toaster } from "@/ui/Toaster";

void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { scheme, colors } = useTheme();
  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      <Toaster />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Ovo_400Regular, YoungSerif_400Regular, Merriweather_400Regular, Merriweather_700Bold });
  const ready = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <RootStack />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
