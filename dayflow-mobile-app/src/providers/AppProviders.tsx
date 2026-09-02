import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { NotificationProvider } from "@notifications/context/NotificationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { ScreenProvider } from "./ScreenProvider";
import { AuthProvider } from "./AuthProvider";
import { DrawerProvider } from "./DrawerProvider";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@config/toastConfig";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const rawColorScheme = useColorScheme();
  const colorScheme = rawColorScheme || "light";
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <AuthProvider>
                    <BottomSheetModalProvider>
                      <DrawerProvider>
                        <ScreenProvider
                          edges={["top", "left", "right", "bottom"]}
                        >
                          {children}
                          <Toast
                            config={getToastConfig(isDark)}
                            topOffset={60}
                          />
                        </ScreenProvider>
                      </DrawerProvider>
                    </BottomSheetModalProvider>
                  </AuthProvider>
                </GestureHandlerRootView>
              </ThemeProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};
