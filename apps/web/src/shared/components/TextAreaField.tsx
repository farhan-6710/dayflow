import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import type { TextAreaFieldProps } from "@/shared/types/components";
import { Textarea } from "@/shared/ui/textarea";

export function TextAreaField({ id, label, onChange, ...props }: TextAreaFieldProps) {
  return (
    <div className={formFieldGroupClassName}>
      <label htmlFor={id} className={formLabelClassName}>
        {label}
      </label>
      <Textarea id={id} className="min-h-20 bg-background" onChange={(event) => onChange(event.target.value)} {...props} />
    </div>
  );
}
