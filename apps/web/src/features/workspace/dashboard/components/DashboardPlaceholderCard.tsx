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
    <DashboardPanel className="flex min-h-44 flex-col px-5 pt-5 pb-5">
      <h3 className="pl-1 text-2xl leading-none font-bold">
        {title}
      </h3>
      <p className="mt-2 pl-1 text-sm text-foreground/75">{description}</p>
      <div className="surface-chip mt-4 flex flex-1 items-center justify-center rounded-[0.8rem] border-dashed">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Coming soon
        </span>
      </div>
    </DashboardPanel>
  );
}
