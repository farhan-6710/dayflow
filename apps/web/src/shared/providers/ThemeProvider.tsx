import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ThemeEffects } from "@/shared/components/ThemeEffects";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="DF-theme"
      disableTransitionOnChange
      // Client-rendered app: main.tsx applies the theme, so next-themes' inline script is inert.
      scriptProps={{ type: "application/json" }}
    >
      <ThemeEffects />
      {children}
    </NextThemesProvider>
  );
}
