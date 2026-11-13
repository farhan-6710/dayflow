import { Switch } from "@/shared/ui/switch";
import type { PreferenceToggleRowProps } from "@/shared/settings/types/components";

export function PreferenceToggleRow({
  id,
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: PreferenceToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium">
          {title}
        </label>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      <Switch
        id={id}
        className="relative mt-0.5 shrink-0 after:absolute after:-inset-3"
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
