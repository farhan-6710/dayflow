import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { SettingsCardProps } from "@/shared/settings/types/components";

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <section className={cn(panelClassName, "p-5")}>
      <h2 className="text-xl">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
