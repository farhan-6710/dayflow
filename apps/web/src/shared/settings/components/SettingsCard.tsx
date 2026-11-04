import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { SettingsCardProps } from "@/shared/settings/types/components";

export function SettingsCard({ title, description, icon: Icon, children }: SettingsCardProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "p-5")}>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-xl">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground text-pretty">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}
