import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import type { TextFieldProps } from "@/shared/types/components";
import { Input } from "@/shared/ui/input";

export function TextField({ id, label, hint, onChange, ...inputProps }: TextFieldProps) {
  return (
    <div className={formFieldGroupClassName}>
      <label htmlFor={id} className={formLabelClassName}>
        {label}
      </label>
      <Input
        id={id}
        className="h-10 bg-background disabled:bg-muted"
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        {...inputProps}
      />
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
