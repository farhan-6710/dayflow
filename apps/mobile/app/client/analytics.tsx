import { ChartPie, CircleCheck, Hourglass, Layers } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";

import { useClientOverview, usePortalProjects } from "@/features/clientPortal/useClientOverview";
import { useRefresh } from "@/lib/query";
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

export default function ClientAnalyticsScreen() {
  const { colors } = useTheme();
  const projects = usePortalProjects();
  const overview = useClientOverview();
  const refresh = useRefresh(projects, overview);
  const tasks = overview.data?.tasks ?? [];
  const meetings = overview.data?.meetings ?? [];
  const calls = overview.data?.calls ?? [];
  const all: { project_id: string; status: string }[] = [...tasks, ...meetings, ...calls];
  const completed = all.filter((item) => item.status === "completed").length;
  const inProgress = all.filter((item) => item.status === "in_progress").length;
  const pending = all.length - completed - inProgress;
  const rate = all.length > 0 ? Math.round((completed / all.length) * 100) : 0;
  const failed = (overview.isError && !overview.data) || (projects.isError && !projects.data);
  const ready = overview.data && projects.data;

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
          </View>
        ) : all.length === 0 ? (
          <EmptyState art="activities" title="No activity yet" description="Numbers appear as tasks, meetings and calls come in." />
        ) : (
          <>
            <View className="flex-row flex-wrap gap-3">
              <StatTile label="All activities" value={all.length} icon={Layers} />
              <StatTile label="Open" value={all.length - completed} icon={Hourglass} />
              <StatTile label="Completed" value={completed} icon={CircleCheck} />
              <StatTile label="Completion rate" value={`${rate}%`} icon={ChartPie} />
            </View>
            <Card className="gap-3">
              <Text variant="heading">Activities by status</Text>
              <DonutChart
                centerValue={String(all.length)}
                centerLabel="total"
                slices={[
                  { label: "Pending", value: pending, color: colors["chart-4"] },
                  { label: "In progress", value: inProgress, color: colors["chart-1"] },
                  { label: "Completed", value: completed, color: colors.success },
                ]}
              />
            </Card>
            <Card className="gap-3">
              <Text variant="heading">By type</Text>
              <BarList
                rows={[
                  { key: "tasks", label: "Tasks", value: tasks.length },
                  { key: "meetings", label: "Meetings", value: meetings.length },
                  { key: "calls", label: "Calls", value: calls.length },
                ]}
              />
            </Card>
            <Card className="gap-3">
              <Text variant="heading">By project</Text>
              <BarList
                rows={(projects.data ?? []).map((project) => {
                  const items = all.filter((item) => item.project_id === project.id);
                  const done = items.filter((item) => item.status === "completed").length;
                  return { key: project.id, label: project.name, value: items.length, color: project.color_hex, caption: `${items.length - done} open · ${done} done` };
                })}
              />
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
