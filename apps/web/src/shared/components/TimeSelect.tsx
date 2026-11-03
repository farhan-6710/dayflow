import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { AVAILABLE_TIMES } from "@/shared/constants/times";
import type { TimeSelectProps } from "@/shared/types/components";

export function TimeSelect({ label, value, onChange, disabled = false }: TimeSelectProps) {
  // Older rows may hold a time outside the half-hour list: keep it selectable.
  const times = value && !AVAILABLE_TIMES.includes(value) ? [value, ...AVAILABLE_TIMES] : AVAILABLE_TIMES;

  return (
    <div className={formFieldGroupClassName}>
      <span className={formLabelClassName}>{label}</span>
      <OptionDropdown
        label={label}
        value={value}
        onChange={onChange}
        options={times.map((time) => ({ value: time, label: time }))}
        placeholder="Select time"
        disabled={disabled}
        className="bg-background"
      />
    </div>
  );
}
