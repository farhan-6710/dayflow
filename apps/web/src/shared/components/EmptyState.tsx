import { DayflowImage } from "@/shared/components/DayflowImage";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { EmptyStateProps } from "@/shared/types/components";

export function EmptyState({ title, description, image, action, bare = false, className }: EmptyStateProps) {
  const Wrapper = bare ? "div" : Reveal;

  return (
    <Wrapper
      className={cn(
        "flex flex-col items-center px-6 py-12 text-center",
        !bare && panelClassName,
        className,
      )}
    >
      {image ? <DayflowImage name={image} className="mb-4 size-20" /> : null}
      <h2 className="text-xl">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground text-pretty">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Wrapper>
  );
}
