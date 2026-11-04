import { useRouter } from "expo-router";
import { Pause, Pencil, Play, Trash2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { ProjectChip } from "@/features/projects/ProjectChip";
import { ProjectFormSheet } from "@/features/projects/ProjectFormSheet";
import { useProjectActions, useProjects } from "@/features/projects/useProjects";
import { useRefresh } from "@/lib/query";
import type { Project } from "@/shared/types/types";
import { moveId, reorderItems } from "@/shared/utils/reorderItems";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { ChipGroup } from "@/ui/ChipGroup";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { Fab } from "@/ui/Fab";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { MoveButtons } from "@/ui/MoveButtons";
import { Screen, TabHeader } from "@/ui/Screen";
import { SearchInput } from "@/ui/SearchInput";
import { StatusPill } from "@/ui/StatusPill";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type StatusFilter = "active" | "inactive" | "all";
type TypeFilter = "all" | "personal" | "client";

export default function ProjectsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const query = useProjects();
  const refresh = useRefresh(query);
  const { setActive, confirmDelete, saveOrder } = useProjectActions();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [type, setType] = useState<TypeFilter>("all");
  const [reordering, setReordering] = useState(false);
  const [form, setForm] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });

  const projects = useMemo(() => query.data ?? [], [query.data]);
  const counts = { active: projects.filter((project) => project.is_active).length, inactive: projects.filter((project) => !project.is_active).length, all: projects.length };

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((project) => {
      if (status === "active" && !project.is_active) return false;
      if (status === "inactive" && project.is_active) return false;
      if (type === "personal" && project.project_for) return false;
      if (type === "client" && !project.project_for) return false;
      return !term || project.name.toLowerCase().includes(term) || project.project_for_label.toLowerCase().includes(term);
    });
  }, [projects, search, status, type]);

  function move(project: Project, direction: -1 | 1) {
    const next = moveId(visible.map((item) => item.id), project.id, direction);
    if (next) saveOrder(reorderItems(projects, next).orderedIds);
  }

  function renderItem({ item: project }: { item: Project }) {
    const content = (
      <View className="flex-row items-center gap-3 p-3.5">
        <ProjectChip color={project.color_hex} />
        <View className="flex-1">
          <Text variant="subheading" numberOfLines={1}>
            {project.name}
          </Text>
          <Text variant="label" tone="muted" numberOfLines={1}>
            {project.project_for_label}
          </Text>
        </View>
        {reordering ? <MoveButtons name={project.name} onMove={(direction) => move(project, direction)} /> : <StatusPill label={project.is_active ? "Active" : "Inactive"} tone={project.is_active ? "success" : "muted"} />}
      </View>
    );
    return (
      <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {reordering ? (
          content
        ) : (
          <SwipeRow
            title={project.name}
            accessibilityLabel={`${project.name}, ${project.project_for_label}, ${project.is_active ? "active" : "inactive"}`}
            onPress={() => router.push(`/project/${project.id}`)}
            actions={[
              { label: "Edit", icon: Pencil, onPress: () => setForm({ open: true, project }) },
              project.is_active
                ? { label: "Deactivate", icon: Pause, onPress: () => setActive.mutate({ project, isActive: false }) }
                : { label: "Activate", icon: Play, onPress: () => setActive.mutate({ project, isActive: true }) },
              { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(project) },
            ]}
          >
            {content}
          </SwipeRow>
        )}
      </View>
    );
  }

  return (
    <Screen>
      <TabHeader
        title="Projects"
        subtitle={query.data ? `${counts.active} active of ${counts.all}` : undefined}
        right={visible.length > 1 ? <Button label={reordering ? "Done" : "Reorder"} size="sm" variant="outline" onPress={() => setReordering(!reordering)} /> : null}
      />
      <FlatList
        data={query.data ? visible : []}
        keyExtractor={(project) => project.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96, gap: 10 }}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <SearchInput value={search} onChangeText={setSearch} placeholder="Search projects" />
            <ChipGroup
              scroll
              options={[
                { value: "active", label: `Active ${counts.active}` },
                { value: "inactive", label: `Inactive ${counts.inactive}` },
                { value: "all", label: `All ${counts.all}` },
              ]}
              value={status}
              onChange={setStatus}
            />
            <ChipGroup
              scroll
              options={[
                { value: "all", label: "All types" },
                { value: "personal", label: "Personal" },
                { value: "client", label: "Client" },
              ]}
              value={type}
              onChange={setType}
            />
          </View>
        }
        ListEmptyComponent={
          query.isError && !query.data ? (
            <ErrorState onRetry={() => void query.refetch()} />
          ) : !query.data ? (
            <ListSkeleton />
          ) : projects.length === 0 ? (
            <EmptyState art="projects" title="No projects yet" description="Create one for yourself or a client." actionLabel="Add project" onAction={() => setForm({ open: true, project: null })} />
          ) : (
            <EmptyState art="search" title="No matches" description="Try a different search or filter." />
          )
        }
      />
      <Fab label="New project" onPress={() => setForm({ open: true, project: null })} />
      <ProjectFormSheet open={form.open} project={form.project} onClose={() => setForm((current) => ({ ...current, open: false }))} />
    </Screen>
  );
}
