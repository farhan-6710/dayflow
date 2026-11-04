import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ProjectNoteSkeleton() {
  return (
    <Phantom>
      <PageHeader backButton={<span className="text-sm">A project name</span>} heading="A note title" />
      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className={cn(panelClassName, "flex min-h-[28rem] min-w-0 flex-col")}>
          <div className="flex items-center justify-between gap-2 border-b border-border p-3">
            <div className="h-10 w-36 rounded-lg" />
            <div className="h-10 w-48 rounded-lg" />
          </div>
          <div className="grid justify-items-start gap-3 p-5">
            <span className="text-2xl">A note title goes here</span>
            <span className="text-sm">The first line of the note goes here, and it runs on for a while.</span>
            <span className="text-sm">The second line of the note goes here.</span>
          </div>
        </div>
        <TableSkeleton rows={2} panel title="Reference links" cells={[["A link label", "https://example.com/a-page"]]} />
      </div>
    </Phantom>
  );
}
