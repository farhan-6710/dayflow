import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";

import { ActivitiesPanel } from "@/features/activities/ActivitiesPanel";
import { useActivities } from "@/features/activities/useActivities";
import { usePortalProjects } from "@/features/clientPortal/useClientOverview";
import { ProjectChip } from "@/features/projects/ProjectChip";
import { useRefresh } from "@/lib/query";
import { useTheme } from "@/theme/ThemeProvider";
import { EmptyState } from "@/ui/EmptyState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

export default function ClientProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const projects = usePortalProjects();
  const activities = useActivities({ kind: "project", id });
  const refresh = useRefresh(projects, activities);

  return (
    <Screen>
      <BackHeader title="Project" />
      <ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        <QueryState query={projects} skeleton={<ListSkeleton rows={3} />}>
          {(rows) => {
            const project = rows.find((row) => row.id === id);
            if (!project) {
              return <EmptyState art="projects" title="Project not found" description="It may no longer be shared with you." actionLabel="Back" onAction={() => router.back()} />;
            }
            return (
              <>
                <View className="flex-row items-center gap-3">
                  <ProjectChip color={project.color_hex} size={52} />
                  <View className="flex-1 gap-1">
                    <Text variant="title" numberOfLines={2}>
                      {project.name}
                    </Text>
                    <View className="flex-row flex-wrap items-center gap-2">
                      <StatusPill label={project.is_active ? "Active" : "Inactive"} tone={project.is_active ? "success" : "muted"} />
                      <Text variant="label" tone="muted">
                        {`Updated ${format(new Date(project.updated_at), "MMM d, yyyy")}`}
                      </Text>
                    </View>
                  </View>
                </View>
                <ActivitiesPanel scope={{ kind: "project", id }} raisedBy="client" projects={[{ id: project.id, name: project.name }]} />
              </>
            );
          }}
        </QueryState>
      </ScrollView>
    </Screen>
  );
}
