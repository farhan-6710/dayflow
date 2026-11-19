import { useEffect, useState } from "react";

import { DemoLoginButton } from "@/shared/auth/components/DemoLoginButton";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { BRAND_NAME } from "@/shared/brand/brandManifest";

/** Coral, darkened in the light theme so it keeps 4.5:1 on the card. */
const credentialClassName = "select-all font-medium text-[color-mix(in_oklab,var(--chart-1)_60%,var(--foreground))] dark:text-chart-1";

/** Waits this long on the sign-in screen before offering the demo, so the page is seen first. */
const OPEN_DELAY_MS = 1000;

/**
 * For recruiters and anyone evaluating the app: opens once on the sign-in screen with the shared demo
 * credentials. Closing it leaves the form as it was.
 */
export function DemoAccountDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl leading-tight text-success-text">Just looking around?</DialogTitle>
          <DialogDescription className="text-pretty">
            You don&apos;t need an account to try {BRAND_NAME}. Continue with the shared demo account, which already has
            clients, projects and tasks in it.
          </DialogDescription>
        </DialogHeader>

        <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className={cn(credentialClassName, "m-0 break-all")}>{DEMO_ACCOUNT.email}</dd>
          <dt className="text-muted-foreground">Password</dt>
          <dd className={cn(credentialClassName, "m-0")}>{DEMO_ACCOUNT.password}</dd>
        </dl>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <DemoLoginButton label="Continue with demo account" />
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setOpen(false)}>
            Use my own account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
