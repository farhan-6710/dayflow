import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import type { PasswordFieldProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function PasswordField({ id, label, hint, value, onChange, ...inputProps }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className={formFieldGroupClassName}>
      <label htmlFor={id} className={formLabelClassName}>
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 bg-background pr-11"
          aria-describedby={hint ? `${id}-hint` : undefined}
          required
          {...inputProps}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="absolute top-0 right-0 text-muted-foreground"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          <Icon aria-hidden="true" />
        </Button>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
