import { RouterProvider } from "react-router";
import { AuthProvider } from "@/features/workspace/auth/providers/AuthProvider";
import { useTauriOAuthDeepLink } from "@/features/workspace/auth/hooks/useTauriOAuthDeepLink";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "@/shared/ui/sonner";
import { router } from "./router";

function App() {
  useTauriOAuthDeepLink();

  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
