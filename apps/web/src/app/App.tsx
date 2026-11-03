import { BRAND_NAME, BRAND_TAGLINE } from "@/shared/brand/brandManifest";
import { Button } from "@/shared/ui/button";

// Phase 1 placeholder: proves theme, fonts and shadcn wiring. Phase 2 replaces it with the router.
export function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl">{BRAND_NAME}</h1>
      <p className="font-serif text-muted-foreground">{BRAND_TAGLINE}</p>
      <Button
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        Toggle theme
      </Button>
    </main>
  );
}
