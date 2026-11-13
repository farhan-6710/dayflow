import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { RouterProvider } from "react-router";

import { router } from "@/app/router";
import { useTauriOAuthDeepLink } from "@/shared/auth/hooks/useTauriOAuthDeepLink";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { UserSettingsProvider } from "@/shared/providers/UserSettingsProvider";
import { Toaster } from "@/shared/ui/sonner";

function AppShell() {
  useTauriOAuthDeepLink();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <AuthProvider>
          <ThemeProvider>
            <UserSettingsProvider>
              <AppShell />
            </UserSettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
