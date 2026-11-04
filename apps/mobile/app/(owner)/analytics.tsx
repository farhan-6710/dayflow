import { useQuery } from "@tanstack/react-query";
import { CircleCheck, FileText, ListChecks, Percent } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";

import { useUserId } from "@/features/auth/AuthProvider";
import { useProjects } from "@/features/projects/useProjects";
import { TASK_STATUS } from "@/features/tasks/taskMeta";
import { useTasks } from "@/features/tasks/useTasks";
import { useRefresh } from "@/lib/query";
import { fetchNotes } from "@/services/notesService";
import type { TaskStatus } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { BarList } from "@/ui/BarList";
import { Card } from "@/ui/Card";
import { DonutChart } from "@/ui/DonutChart";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { BackHeader, Screen } from "@/ui/Screen";
import { Skeleton } from "@/ui/Skeleton";
import { StatTile } from "@/ui/StatTile";
import { Text } from "@/ui/Text";

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const userId = useUserId();
  const tasksQuery = useTasks();
  const projectsQuery = useProjects();
  const notesQuery = useQuery({ queryKey: ["notes", "all"], queryFn: () => fetchNotes(userId) });
  const refresh = useRefresh(tasksQuery, projectsQuery, notesQuery);

  const tasks = tasksQuery.data ?? [];
  const notes = notesQuery.data ?? [];
  const completed = tasks.filter((task) => task.status === "done").length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const failed = (tasksQuery.isError && !tasksQuery.data) || (notesQuery.isError && !notesQuery.data) || (projectsQuery.isError && !projectsQuery.data);
  const ready = tasksQuery.data && notesQuery.data && projectsQuery.data;
  const byProject = (projectsQuery.data ?? [])
    .map((project) => ({ key: project.id, label: project.name, color: project.color_hex, value: notes.filter((note) => note.project_id === project.id).length }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <Screen>
      <BackHeader title="Analytics" />
      <ScrollView refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {failed ? (
          <ErrorState onRetry={() => void refresh.onRefresh()} />
        ) : !ready ? (
          <View className="gap-3">
            <View className="flex-row flex-wrap gap-3">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-24 flex-1 basis-[44%] rounded-2xl" />
              ))}
            </View>
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </View>
        ) : (
          <>
            <View className="flex-row flex-wrap gap-3">
              <StatTile label="Total tasks" value={tasks.length} icon={ListChecks} />
              <StatTile label="Completed" value={completed} icon={CircleCheck} />
              <StatTile label="Completion rate" value={`${rate}%`} icon={Percent} />
              <StatTile label="Total notes" value={notes.length} icon={FileText} />
            </View>
            <Card className="gap-3">
              <Text variant="heading">Task status</Text>
              {tasks.length === 0 ? (
                <EmptyState art="tasks" title="No tasks yet" />
              ) : (
                <DonutChart
                  centerValue={`${rate}%`}
                  centerLabel="done"
                  slices={(Object.keys(TASK_STATUS) as TaskStatus[]).map((status) => ({ label: TASK_STATUS[status].label, value: tasks.filter((task) => task.status === status).length, color: colors[TASK_STATUS[status].color] }))}
                />
              )}
            </Card>
            <Card className="gap-3">
              <Text variant="heading">Notes per project</Text>
              {byProject.length === 0 ? <EmptyState art="notes" title="No notes yet" /> : <BarList rows={byProject} />}
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
