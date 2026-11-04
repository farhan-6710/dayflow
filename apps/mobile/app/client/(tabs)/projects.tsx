import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, View } from "react-native";

import { usePortalProjects } from "@/features/clientPortal/useClientOverview";
import { ProjectChip } from "@/features/projects/ProjectChip";
import { useRefresh } from "@/lib/query";
import { useTheme } from "@/theme/ThemeProvider";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { Screen, TabHeader } from "@/ui/Screen";
import { SearchInput } from "@/ui/SearchInput";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

export default function ClientProjectsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const query = usePortalProjects();
  const refresh = useRefresh(query);
  const [search, setSearch] = useState("");
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (query.data ?? []).filter((project) => !term || project.name.toLowerCase().includes(term));
  }, [query.data, search]);

  return (
    <Screen>
      <TabHeader title="Projects" subtitle="Shared with you" />
      <FlatList
        data={query.data ? visible : []}
        keyExtractor={(project) => project.id}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 10 }}
        ListHeaderComponent={<SearchInput value={search} onChangeText={setSearch} placeholder="Search projects" />}
        renderItem={({ item: project }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={project.name}
            onPress={() => router.push(`/client/project/${project.id}`)}
            className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm active:opacity-80"
          >
            <ProjectChip color={project.color_hex} />
            <Text variant="subheading" numberOfLines={1} className="flex-1">
              {project.name}
            </Text>
            <StatusPill label={project.is_active ? "Active" : "Inactive"} tone={project.is_active ? "success" : "muted"} />
          </Pressable>
        )}
        ListEmptyComponent={
          query.isError && !query.data ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : !query.data ? (
            <ListSkeleton />
          ) : (query.data ?? []).length === 0 ? (
            <EmptyState art="projects" title="No shared projects yet" description="Your freelancer's projects for you will appear here." />
          ) : (
            <View>
              <EmptyState art="search" title="No matches" description="Try a different search." />
            </View>
          )
        }
      />
    </Screen>
  );
}
