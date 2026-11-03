import { Loader2 } from "lucide-react";

import type { SubmitButtonProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";

export function SubmitButton({ loading, disabled, variant, className, children }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" variant={variant} disabled={loading || disabled} className={className}>
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </Button>
  );
}
