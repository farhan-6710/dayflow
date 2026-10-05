import { DashboardPanel } from "@/features/workspace/dashboard/components/DashboardPanel";

type DashboardPlaceholderCardProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholderCard({
  title,
  description,
}: DashboardPlaceholderCardProps) {
  return (
    <DashboardPanel className="flex min-h-44 flex-col p-5">
      <h3 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/50">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Coming soon
        </span>
      </div>
    </DashboardPanel>
  );
}
