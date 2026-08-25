import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchTasks, type Task } from "@/services/tasksService";
import { fetchProjects, type Project } from "@/services/projectsService";
import { fetchNotes, type Note } from "@/services/notesService";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { StatsCards } from "@/shared/components/StatsCards";
import { showToast } from "@/shared/utils/showToast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import { BarChart3, CheckSquare, ListTodo, FileText } from "lucide-react";

export function AnalyticsPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [allTasks, allProjects, allNotes] = await Promise.all([
        fetchTasks(user.id),
        fetchProjects(user.id),
        fetchNotes(user.id),
      ]);
      setTasks(allTasks);
      setProjects(allProjects);
      setNotes(allNotes);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const cards = [
    {
      id: "total-tasks",
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      description: "Standalone personal tasks",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      value: `${completedTasks}/${totalTasks}`,
      icon: CheckSquare,
      description: "Tasks marked done",
    },
    {
      id: "completion-rate",
      label: "Completion Rate",
      value: `${taskCompletionRate}%`,
      icon: BarChart3,
      description: "Share of tasks completed",
    },
    {
      id: "total-notes",
      label: "Total Notes",
      value: notes.length,
      icon: FileText,
      description: "Notes across all projects",
    },
  ];

  const statusData = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const done = completedTasks;
    const missed = tasks.filter((t) => t.status === "missed").length;

    return [
      { name: "To Do", value: todo, color: "#94a3b8" },
      { name: "In Progress", value: inProgress, color: "#028595" },
      { name: "Completed", value: done, color: "#ff7e21" },
      { name: "Missed", value: missed, color: "#c94141" },
    ];
  }, [tasks, completedTasks]);

  const notesByProjectData = useMemo(() => {
    const rows: Array<{ name: string; count: number }> = projects.map((project) => ({
      name: project.name,
      count: notes.filter((note) => note.project_id === project.id).length,
    }));

    const unassigned = notes.filter((note) => !note.project_id).length;
    if (unassigned > 0) {
      rows.push({ name: "No Project", count: unassigned });
    }

    return rows.filter((row) => row.count > 0);
  }, [projects, notes]);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Workspace Analytics"
        description="Track task completion and see how notes are distributed across projects."
      />

      <PageContent>
        <StatsCards cards={cards} isLoading={loading} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col h-[380px]">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Task Status Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ratio of to-do, in-progress, and completed tasks.
            </p>

            <div className="flex-1 flex items-center justify-center min-h-0 mt-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading chart...</div>
              ) : totalTasks === 0 ? (
                <div className="text-sm text-muted-foreground">No task data to display</div>
              ) : (
                <div className="relative size-full max-w-[280px] max-h-[220px]">
                  <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold tracking-tight">{taskCompletionRate}%</span>
                    <span className="text-3xs text-muted-foreground uppercase font-bold tracking-wider">
                      Completed
                    </span>
                  </div>
                  <div className="relative z-10 size-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const item = payload[0];
                            return (
                              <div className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl">
                                <p className="font-medium">{item.name}</p>
                                <p className="mt-0.5 text-muted-foreground">
                                  Tasks :{" "}
                                  <span className="font-medium text-foreground">{item.value}</span>
                                </p>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {!loading && totalTasks > 0 ? (
              <div className="flex items-center justify-center gap-6 text-xs mt-4">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground font-medium">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col h-[380px]">
            <h3 className="text-sm font-bold tracking-tight text-foreground">Notes by Project</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              How your notes are organized across project folders.
            </p>

            <div className="flex-1 min-h-0 mt-6">
              {loading ? (
                <div className="size-full flex items-center justify-center text-sm text-muted-foreground">
                  Loading chart...
                </div>
              ) : notesByProjectData.length === 0 ? (
                <div className="size-full flex items-center justify-center text-sm text-muted-foreground">
                  No note data to display
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={notesByProjectData}
                    margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                    <RechartsTooltip
                      cursor={{ fill: "color-mix(in oklch, var(--foreground) 8%, transparent)" }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl">
                            <p className="font-medium">{label}</p>
                            {payload.map((item) => (
                              <p key={String(item.dataKey)} className="mt-0.5 text-muted-foreground">
                                {item.name} :{" "}
                                <span className="font-medium text-foreground">{item.value}</span>
                              </p>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="count" name="Notes" fill="#ff7e21" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
