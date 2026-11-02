import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { DEMO_ACCOUNT } from "@/features/workspace/auth/constants/demoAccount";
import { MOTION_EASE } from "@/shared/constants/pageMotion";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type DemoAccountLoginPromptProps = {
  disabled?: boolean;
  onDemoLogin: () => void | Promise<void>;
};

export function DemoAccountLoginPrompt({
  disabled = false,
  onDemoLogin,
}: DemoAccountLoginPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (isDismissed) {
    return null;
  }

  return createPortal(
    <motion.aside
      role="complementary"
      aria-label="Demo account login"
      initial={{ opacity: 0, x: "110%" }}
      animate={
        isVisible
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: "110%" }
      }
      transition={{ duration: 0.48, ease: MOTION_EASE }}
      className={cn(
        "pointer-events-auto fixed top-4 right-4 z-50 w-[min(100vw-2rem,22rem)]",
        "surface-elevated rounded-[1.25rem] p-4",
        "sm:top-6 sm:right-6",
      )}
    >
      <button
        type="button"
        aria-label="Dismiss demo account prompt"
        className="absolute top-3.5 right-3.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        disabled={disabled}
        onClick={() => setIsDismissed(true)}
      >
        <X className="size-4" aria-hidden="true" />
      </button>

      <div className="space-y-3">
        <div className="flex items-start gap-3 pr-6">
          <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-[color-mix(in_srgb,var(--primary)_42%,var(--card))] text-primary-text">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>

          <div className="min-w-0 space-y-1">
            <h2 className="text-xl leading-tight font-bold text-foreground">
              Login with demo account
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Try DayFlow demo instantly with the shared workspace credentials below.
            </p>
          </div>
        </div>

        <dl className="surface-chip w-full space-y-1.5 rounded-[0.8rem] px-3 py-2.5 text-xs">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-muted-foreground">Email</dt>
            <dd className="truncate font-semibold text-foreground">
              {DEMO_ACCOUNT.email}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-medium text-muted-foreground">Password</dt>
            <dd className="font-semibold text-foreground">
              {DEMO_ACCOUNT.password}
            </dd>
          </div>
        </dl>

        <Button
          type="button"
          className="h-9 w-full"
          disabled={disabled}
          onClick={() => void onDemoLogin()}
        >
          {disabled ? (
            <>
              <LoadingSpinner size="sm" />
              Signing in...
            </>
          ) : (
            "Login with DayFlow demo account"
          )}
        </Button>
      </div>
    </motion.aside>,
    document.body,
  );
}
