import * as React from "react"

import { formControlFocusRingClassName } from "@/shared/constants/formStyles"
import { cn } from "@/shared/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-ring/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[border-color,box-shadow] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:border-input dark:bg-muted/40 dark:disabled:bg-muted/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
        formControlFocusRingClassName,
        className
      )}
      {...props}
    />
  )
}

export { Input }
