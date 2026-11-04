import { useState } from "react";
import { m } from "framer-motion";
import { X } from "lucide-react";

import { DemoLoginButton } from "@/shared/auth/components/DemoLoginButton";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

/** Coral, darkened in the light theme so it keeps 4.5:1 on the card. */
const credentialClassName ="select-all text-[color-mix(in_oklab,var(--chart-1)_60%,var(--foreground))] dark:text-chart-1";

const SLIDE_IN = { delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * For recruiters and anyone evaluating the app. It floats above the sign-in screen so the form never
 * moves, and can be dismissed where it overlaps. It sits beside the theme toggle on desktop, and
 * under the logo row on smaller screens to keep the toggle reachable.
 */
export function DemoAccountCard() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] z-20 flex justify-end px-4 lg:top-3 lg:right-14 lg:px-0">
      <m.aside
        aria-label="Demo account"
        initial={{ x: "120%" }}
        animate={{ x: 0 }}
        transition={SLIDE_IN}
        className={cn(panelClassName,"pointer-events-auto relative w-full max-w-xs px-4 py-3")}
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
        <dl className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className={cn(credentialClassName,"break-all")}>{DEMO_ACCOUNT.email}</dd>
          <dt className="text-muted-foreground">Password</dt>
          <dd className={credentialClassName}>{DEMO_ACCOUNT.password}</dd>
        </dl>
        <div className="mt-2">
          <DemoLoginButton label="Open the demo" />
        </div>
      </m.aside>
    </div>
  );
}
