import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EllipsisVertical, FileText, Link2, Pause, Pencil, Play, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { NotesPanel } from "@/features/projects/NotesPanel";
import { ProjectChip } from "@/features/projects/ProjectChip";
import { ProjectFormSheet } from "@/features/projects/ProjectFormSheet";
import { ReferenceLinks } from "@/features/projects/ReferenceLinks";
import { useProjectNotes } from "@/features/projects/useNotes";
import { useProject, useProjectActions } from "@/features/projects/useProjects";
import { useReferenceLinks } from "@/features/projects/useReferenceLinks";
import { useRefresh } from "@/lib/query";
import { useTheme } from "@/theme/ThemeProvider";
import { ActionSheet } from "@/ui/ActionSheet";
import { EmptyState } from "@/ui/EmptyState";
import { Fab } from "@/ui/Fab";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { StatTile } from "@/ui/StatTile";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

type Tab = "overview" | "notes" | "links";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const query = useProject(id);
  const notes = useProjectNotes(id);
  const links = useReferenceLinks({ kind: "project", id }).query;
  const refresh = useRefresh(query, notes, links);
  const { setActive, confirmDelete } = useProjectActions();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const project = query.data;

  const tabs: { value: Tab; label: string }[] = [
    { value: "overview", label: "Overview" },
    { value: "notes", label: "Notes" },
    { value: "links", label: "Links" },
  ];

  return (
    <Screen>
      <BackHeader title="Project" right={project ? <IconButton icon={EllipsisVertical} label="Project actions" onPress={() => setMenuOpen(true)} /> : null} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 16 }}
      >
        <QueryState query={query} skeleton={<ListSkeleton rows={4} />}>
          {(loaded) =>
            !loaded ? (
              <EmptyState art="projects" title="Project not found" description="It may have been deleted." actionLabel="Back" onAction={() => router.back()} />
            ) : (
              <>
                <View className="flex-row items-center gap-3">
                  <ProjectChip color={loaded.color_hex} size={52} />
                  <View className="flex-1 gap-1">
                    <Text variant="title" numberOfLines={2}>
                      {loaded.name}
                    </Text>
                    <View className="flex-row flex-wrap items-center gap-2">
                      <StatusPill label={loaded.is_active ? "Active" : "Inactive"} tone={loaded.is_active ? "success" : "muted"} />
                      <Text variant="label" tone="muted">
                        {loaded.project_for ? `For ${loaded.project_for_label}` : "Personal"}
                      </Text>
                    </View>
                  </View>
                </View>
                <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />
                {tab === "overview" ? (
                  <View className="gap-4">
                    <View className="flex-row flex-wrap gap-3">
                      <StatTile label="Notes" value={notes.data?.length ?? "–"} icon={FileText} onPress={() => setTab("notes")} />
                      <StatTile label="Links" value={links.data?.length ?? "–"} icon={Link2} onPress={() => setTab("links")} />
                    </View>
                    <Text variant="label" tone="muted">
                      {`Created ${format(new Date(loaded.created_at), "MMM d, yyyy")} · Updated ${format(new Date(loaded.updated_at), "MMM d, yyyy")}`}
                    </Text>
                  </View>
                ) : null}
                {tab === "notes" ? <NotesPanel projectId={id} /> : null}
                {tab === "links" ? <ReferenceLinks owner={{ kind: "project", id }} heading={false} /> : null}
              </>
            )
          }
        </QueryState>
      </ScrollView>
      {project && tab !== "links" ? <Fab label="New note" onPress={() => router.push(`/project/${id}/note/new`)} /> : null}
      <ProjectFormSheet open={editing} project={project} onClose={() => setEditing(false)} />
      {project ? (
        <ActionSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          title={project.name}
          actions={[
            { label: "Edit project", icon: Pencil, onPress: () => setEditing(true) },
            project.is_active
              ? { label: "Deactivate", icon: Pause, onPress: () => setActive.mutate({ project, isActive: false }) }
              : { label: "Activate", icon: Play, onPress: () => setActive.mutate({ project, isActive: true }) },
            {
              label: "Delete project",
              icon: Trash2,
              destructive: true,
              onPress: () => {
                void confirmDelete(project).then((deleted) => {
                  if (deleted) router.back();
                });
              },
            },
          ]}
        />
      ) : null}
    </Screen>
  );
}
