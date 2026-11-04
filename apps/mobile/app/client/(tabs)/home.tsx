import { CircleCheck, Layers, Phone, Users } from "lucide-react-native";
import { format } from "date-fns";
import { RefreshControl, ScrollView, View } from "react-native";

import { useNewActivityCount } from "@/features/activities/useNewActivityCount";
import { useAuth } from "@/features/auth/AuthProvider";
import { ActivitiesPanel } from "@/features/activities/ActivitiesPanel";
import { useClientOverview, usePortalClient, usePortalProjects } from "@/features/clientPortal/useClientOverview";
import { useRefresh } from "@/lib/query";
import { getGreeting } from "@/shared/utils/greeting";
import { useTheme } from "@/theme/ThemeProvider";
import { Screen, TabHeader } from "@/ui/Screen";
import { SectionHeader } from "@/ui/SectionHeader";
import { Skeleton } from "@/ui/Skeleton";
import { StatTile } from "@/ui/StatTile";
import { ErrorState } from "@/ui/ErrorState";
import { Text } from "@/ui/Text";

export default function ClientHomeScreen() {
  const { colors } = useTheme();
  const { firstName } = useAuth();
  const client = usePortalClient();
  const projects = usePortalProjects();
  const overview = useClientOverview();
  const refresh = useRefresh(projects, overview);
  const newFromFreelancer = useNewActivityCount("workspace");
  const count = <T extends { status: string }>(items: T[] | undefined) => items?.filter((item) => item.status === "completed").length ?? 0;
  const loading = !projects.data || !overview.data;

  return (
    <Screen>
      <TabHeader title={getGreeting()} subtitle={`${firstName} · ${format(new Date(), "EEEE, MMMM d")}`} />
      <ScrollView refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 20 }}>
        {projects.isError && !projects.data ? <ErrorState onRetry={() => void projects.refetch()} /> : null}
        {loading && !projects.isError ? (
          <View className="flex-row flex-wrap gap-3">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-28 flex-1 basis-[44%] rounded-2xl" />
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            <StatTile label="Active projects" value={projects.data?.filter((project) => project.is_active).length ?? 0} icon={Layers} />
            <StatTile label="Tasks completed" value={count(overview.data?.tasks)} icon={CircleCheck} />
            <StatTile label="Meetings completed" value={count(overview.data?.meetings)} icon={Users} />
            <StatTile label="Calls attended" value={count(overview.data?.calls)} icon={Phone} />
          </View>
        )}
        {newFromFreelancer > 0 ? (
          <View accessibilityRole="alert" className="rounded-2xl border border-chart-1 bg-card p-3.5">
            <Text>{`${newFromFreelancer} new ${newFromFreelancer === 1 ? "activity" : "activities"} from your freelancer since your last visit.`}</Text>
          </View>
        ) : null}
        <View className="gap-2">
          <SectionHeader title="Activities" />
          <ActivitiesPanel
            scope={{ kind: "client", id: client.id }}
            raisedBy="client"
            projects={(projects.data ?? []).filter((project) => project.is_active).map((project) => ({ id: project.id, name: project.name }))}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
