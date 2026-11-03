import { MotionConfig } from "framer-motion";
import { RouterProvider } from "react-router";

import { router } from "@/app/router";
import { AuthProvider } from "@/shared/providers/AuthProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "@/shared/ui/sonner";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </ThemeProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
