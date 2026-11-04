import type { ProjectActivityTableProps } from "@/features/client/types/components";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ProjectActivityTable({ rows }: ProjectActivityTableProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">By project</h2>
      {rows.length === 0 ? (
        <EmptyState bare className="py-6" image="icon-empty-projects" title="No projects yet" description="Shared projects are counted here." />
      ) : (
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th scope="col" className="py-2 text-left font-normal">Project</th>
              <th scope="col" className="w-16 py-2 text-right font-normal">Open</th>
              <th scope="col" className="w-16 py-2 text-right font-normal">Done</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0">
                <td className="py-2 pr-2">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <ProjectChip color={row.color} className="size-7 [&_svg]:size-3.5" />
                    <span className="min-w-0 break-words">{row.name}</span>
                  </span>
                </td>
                <td className="py-2 text-right tabular-nums">{row.open}</td>
                <td className="py-2 text-right tabular-nums">{row.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Reveal>
  );
}
