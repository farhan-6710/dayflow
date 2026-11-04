import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EllipsisVertical, FolderOpen, Globe, Hourglass, Mail, Pause, Pencil, Phone, Play, Plus, Trash2, UserRound, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Linking, Pressable, RefreshControl, ScrollView, View } from "react-native";

import { useUserId } from "@/features/auth/AuthProvider";
import { ActivitiesPanel } from "@/features/activities/ActivitiesPanel";
import { useActivities } from "@/features/activities/useActivities";
import { ClientFormSheet } from "@/features/clients/ClientFormSheet";
import { ConversationPanel } from "@/features/clients/ConversationPanel";
import { useClient, useClientActions } from "@/features/clients/useClients";
import { ProjectChip } from "@/features/projects/ProjectChip";
import { ProjectFormSheet } from "@/features/projects/ProjectFormSheet";
import { openLink } from "@/lib/openLink";
import { useRefresh } from "@/lib/query";
import { fetchProjectsByClientId } from "@/services/projectsService";
import { getInitials } from "@/shared/utils/authUserDisplay";
import { useTheme } from "@/theme/ThemeProvider";
import { ActionSheet } from "@/ui/ActionSheet";
import { Avatar } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { QueryState } from "@/ui/QueryState";
import { BackHeader, Screen } from "@/ui/Screen";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { StatTile } from "@/ui/StatTile";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

type Tab = "overview" | "projects" | "activities" | "chat";

const TABS: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "projects", label: "Projects" },
  { value: "activities", label: "Activities" },
  { value: "chat", label: "Chat" },
];

function ContactRow({ icon: Icon, label, value, onPress }: { icon: LucideIcon; label: string; value: string | null; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress && value ? "button" : undefined}
      accessibilityLabel={`${label}: ${value ?? "not set"}`}
      disabled={!onPress || !value}
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 border-b border-border px-3.5 py-2.5 active:bg-muted"
    >
      <Icon size={18} color={colors["muted-foreground"]} />
      <View className="flex-1">
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text numberOfLines={1}>{value ?? "Not set"}</Text>
      </View>
    </Pressable>
  );
}

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const userId = useUserId();
  const query = useClient(id);
  const projects = useQuery({ queryKey: ["projects", "client", id], queryFn: () => fetchProjectsByClientId(userId, id) });
  const activities = useActivities({ kind: "client", id });
  const refresh = useRefresh(query, projects, activities);
  const { setActive, confirmDelete } = useClientActions();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newProject, setNewProject] = useState(false);
  const client = query.data;
  const projectOptions = (projects.data ?? []).map((project) => ({ id: project.id, name: project.name }));
  const openCount = activities.data ? [...activities.data.tasks, ...activities.data.meetings, ...activities.data.calls].filter((item) => item.status !== "completed").length : undefined;

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <BackHeader title={client?.company_name ?? "Client"} right={client ? <IconButton icon={EllipsisVertical} label="Client actions" onPress={() => setMenuOpen(true)} /> : null} />
        <View className="px-4 pb-3 pt-1">
          <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
        </View>
        {tab === "chat" ? (
          <ConversationPanel clientId={id} />
        ) : (
          <ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 16 }}>
            <QueryState query={query} skeleton={<ListSkeleton rows={4} />}>
              {(loaded) =>
                !loaded ? (
                  <EmptyState art="clients" title="Client not found" description="They may have been deleted." actionLabel="Back" onAction={() => router.back()} />
                ) : (
                  <>
                    {tab === "overview" ? (
                      <>
                        <View className="flex-row items-center gap-3">
                          <Avatar initials={getInitials(loaded.company_name)} size={56} />
                          <View className="flex-1 gap-1">
                            <Text variant="title" numberOfLines={2}>
                              {loaded.company_name}
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                              <StatusPill label={loaded.is_active ? "Active" : "Inactive"} tone={loaded.is_active ? "success" : "muted"} />
                              <StatusPill label={loaded.auth_user_id ? "Portal access" : "No portal access"} tone={loaded.auth_user_id ? "progress" : "muted"} />
                            </View>
                          </View>
                        </View>
                        <View className="flex-row flex-wrap gap-3">
                          <StatTile label="Projects" value={projects.data?.length ?? "–"} icon={FolderOpen} onPress={() => setTab("projects")} />
                          <StatTile label="Open activities" value={openCount ?? "–"} icon={Hourglass} onPress={() => setTab("activities")} />
                        </View>
                        <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                          <ContactRow icon={UserRound} label="Contact" value={loaded.client_name} />
                          <ContactRow icon={Phone} label="Mobile" value={loaded.mobile_number} onPress={() => void Linking.openURL(`tel:${loaded.mobile_number}`)} />
                          <ContactRow icon={Mail} label="Email" value={loaded.email} onPress={() => void Linking.openURL(`mailto:${loaded.email}`)} />
                          <ContactRow icon={Globe} label="Website" value={loaded.website_url} onPress={() => void openLink(loaded.website_url ?? "")} />
                          <ContactRow icon={UserRound} label="Secondary contact" value={loaded.secondary_contact_name} />
                          <ContactRow icon={Phone} label="Secondary number" value={loaded.secondary_contact_number} onPress={() => void Linking.openURL(`tel:${loaded.secondary_contact_number}`)} />
                        </View>
                      </>
                    ) : null}
                    {tab === "projects" ? (
                      <View className="gap-3">
                        <QueryState query={projects} skeleton={<ListSkeleton rows={3} />}>
                          {(rows) =>
                            rows.length === 0 ? (
                              <EmptyState art="projects" title="No projects yet" description="Create the first project for this client." />
                            ) : (
                              <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                                {rows.map((project, index) => (
                                  <Pressable
                                    key={project.id}
                                    accessibilityRole="button"
                                    accessibilityLabel={project.name}
                                    onPress={() => router.push(`/project/${project.id}`)}
                                    className={`flex-row items-center gap-3 p-3 active:bg-muted ${index > 0 ? "border-t border-border" : ""}`}
                                  >
                                    <ProjectChip color={project.color_hex} size={36} />
                                    <Text numberOfLines={1} className="flex-1">
                                      {project.name}
                                    </Text>
                                    <StatusPill label={project.is_active ? "Active" : "Inactive"} tone={project.is_active ? "success" : "muted"} />
                                  </Pressable>
                                ))}
                              </View>
                            )
                          }
                        </QueryState>
                        <Button label="New project" variant="outline" icon={Plus} onPress={() => setNewProject(true)} />
                      </View>
                    ) : null}
                    {tab === "activities" ? <ActivitiesPanel scope={{ kind: "client", id }} raisedBy="workspace" projects={projectOptions} clientLabel={loaded.company_name} /> : null}
                  </>
                )
              }
            </QueryState>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <ClientFormSheet open={editing} client={client} onClose={() => setEditing(false)} />
      <ProjectFormSheet open={newProject} defaultClientId={id} onClose={() => setNewProject(false)} />
      {client ? (
        <ActionSheet
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          title={client.company_name}
          actions={[
            { label: "Edit client", icon: Pencil, onPress: () => setEditing(true) },
            client.is_active
              ? { label: "Deactivate", icon: Pause, onPress: () => setActive.mutate({ client, isActive: false }) }
              : { label: "Activate", icon: Play, onPress: () => setActive.mutate({ client, isActive: true }) },
            {
              label: "Delete client",
              icon: Trash2,
              destructive: true,
              onPress: () => {
                void confirmDelete(client).then((deleted) => {
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
