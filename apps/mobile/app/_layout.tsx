import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { Providers as AppProviders } from "@providers/AppProviders";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useNavigationBarTheme } from "@hooks/navigation/useNavigationBarTheme";
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_500Medium,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
  Cinzel_800ExtraBold,
  Cinzel_900Black,
} from "@expo-google-fonts/cinzel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import {
  REMINDER_NOTIFICATION_CHANNEL,
  REMINDER_NOTIFICATION_SOUND,
} from "@notifications/constants";
import "@styles/global.css";
import "@styles/dynamicClasses.css";
import { THEME_COLORS } from "@constants/theme";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode to hide the warning
});

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_500Medium,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    Cinzel_800ExtraBold,
    Cinzel_900Black,
  });

  // Set up navigation bar theme for Android
  useNavigationBarTheme();

  // setup notification channel for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync(REMINDER_NOTIFICATION_CHANNEL, {
        name: "Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: REMINDER_NOTIFICATION_SOUND,
      });
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              colorScheme === "dark"
                ? THEME_COLORS.dark.background
                : THEME_COLORS.light.card,
          },
          headerTintColor:
            colorScheme === "dark"
              ? THEME_COLORS.dark.text
              : THEME_COLORS.light.text,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 17,
            color:
              colorScheme === "dark"
                ? THEME_COLORS.dark.heading
                : THEME_COLORS.light.heading,
          },
          headerBackButtonDisplayMode: "minimal",
          headerBackTitle: "Back",
          headerBackButtonMenuEnabled: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: false,
            title: "Login",
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            headerShown: false,
            title: "Sign Up",
          }}
        />
      </Stack>
    </AppProviders>
  );
}
