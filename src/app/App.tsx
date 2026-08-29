import { RouterProvider } from "react-router";
import { AuthProvider } from "@/features/admin/auth/providers/AuthProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "@/shared/ui/sonner";
import { router } from "./router";

function App() {
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
