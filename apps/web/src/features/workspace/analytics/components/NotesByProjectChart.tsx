import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { EmptyState } from "@/shared/components/EmptyState";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

type NotesByProjectChartProps = {
  data: { name: string; count: number }[];
};

const ROW_HEIGHT = 36;

export function NotesByProjectChart({ data }: NotesByProjectChartProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Notes per project</h2>
      {data.length === 0 ? (
        <EmptyState bare className="py-6" image="icon-empty-notes" title="No notes yet" description="Notes you add to projects are counted here." />
      ) : (
        <div
          className="mt-2"
          style={{ height: Math.max(data.length * ROW_HEIGHT + 32, 160) }}
          role="img"
          aria-label={`Notes per project: ${data.map((row) => `${row.name} ${row.count}`).join(", ")}.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "var(--accent)" }}
                contentStyle={{
                  background: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="count" name="Notes" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Reveal>
  );
}
