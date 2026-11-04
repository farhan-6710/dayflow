import { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, Loader2, X } from "lucide-react";

import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { useDemoLogin } from "@/shared/auth/hooks/useDemoLogin";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Coral, darkened in the light theme so it keeps 4.5:1 on the card. */
const credentialClassName = "select-all text-[color-mix(in_oklab,var(--chart-1)_60%,var(--foreground))] dark:text-chart-1";

const SLIDE_IN = { delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * One-click way in for recruiters and anyone evaluating the app. It floats above the sign-in screen
 * so the form never moves, and can be dismissed where it overlaps. Below `lg` it sits under the
 * logo row to keep the theme toggle reachable.
 */
export function DemoAccountCard() {
  const demo = useDemoLogin();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] z-20 flex justify-center px-4 lg:top-2">
      <m.aside
        aria-label="Demo account"
        initial={{ y: "-150%" }}
        animate={{ y: 0 }}
        transition={SLIDE_IN}
        className={cn(panelClassName, "pointer-events-auto relative w-full max-w-sm px-4 py-3 shadow-lg")}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-muted-foreground"
          aria-label="Dismiss demo account card"
          onClick={() => setDismissed(true)}
        >
          <X aria-hidden="true" />
        </Button>
        <h2 className="pr-8 text-lg leading-tight text-success-text">Just looking around?</h2>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">Open the shared {BRAND_NAME} demo, no sign-up needed.</p>
        <dl className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className={cn(credentialClassName, "break-all")}>{DEMO_ACCOUNT.email}</dd>
          <dt className="text-muted-foreground">Password</dt>
          <dd className={credentialClassName}>{DEMO_ACCOUNT.password}</dd>
        </dl>
        <Button
          type="button"
          size="lg"
          className="mt-2 w-full bg-success text-success-foreground hover:bg-success/90"
          disabled={demo.isSubmitting}
          onClick={() => void demo.login()}
        >
          {demo.isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          Open the demo
          {demo.isSubmitting ? null : <ArrowRight aria-hidden="true" />}
        </Button>
        {demo.error ? (
          <div className="mt-3">
            <AuthFormAlert message={demo.error} variant="error" />
          </div>
        ) : null}
      </m.aside>
    </div>
  );
}
