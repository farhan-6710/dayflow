import { ArrowRight, Loader2 } from "lucide-react";

import { AuthFormAlert } from "@/shared/auth/components/AuthFormAlert";
import { useDemoLogin } from "@/shared/auth/hooks/useDemoLogin";
import type { DemoLoginButtonProps } from "@/shared/auth/types/components";
import { Button } from "@/shared/ui/button";

/** The green one-click way into the shared demo workspace. */
export function DemoLoginButton({ label }: DemoLoginButtonProps) {
  const demo = useDemoLogin();

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="lg"
        className="w-full bg-success text-success-foreground hover:bg-success/90"
        disabled={demo.isSubmitting}
        onClick={() => void demo.login()}
      >
        {demo.isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {label}
        {demo.isSubmitting ? null : <ArrowRight aria-hidden="true" />}
      </Button>
      {demo.error ? <AuthFormAlert message={demo.error} variant="error" /> : null}
    </div>
  );
}
