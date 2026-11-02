import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { DayflowImage } from "@/shared/components/DayflowImage";
import { cn } from "@/shared/lib/utils";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  /** 3D illustration from DAYFLOW_IMAGES; `icon` is shown when it's missing. */
  imageSrc?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  /** Drop the raised panel when the empty state already sits inside one. */
  bare?: boolean;
  className?: string;
};

export function EmptyState({
  title,
  description,
  imageSrc,
  icon: Icon,
  action,
  bare = false,
  className,
}: EmptyStateProps) {
  const iconBadge = Icon ? (
    <span className="grid size-14 place-items-center rounded-full border border-primary/30 bg-[color-mix(in_srgb,var(--primary)_42%,var(--card))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_6px_-2px_color-mix(in_srgb,var(--primary)_45%,transparent)] dark:shadow-none">
      <Icon
        className="size-6 text-primary-text"
        aria-hidden
      />
    </span>
  ) : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center px-6 py-14 text-center",
        !bare && "surface-elevated animate-enter rounded-[1.25rem]",
        className,
      )}
    >
      <div className="mb-4">
        {imageSrc ? (
          <DayflowImage src={imageSrc} className="size-20 object-contain" fallback={iconBadge} />
        ) : (
          iconBadge
        )}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-foreground/75">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
