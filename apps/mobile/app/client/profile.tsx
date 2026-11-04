import { useRouter } from "expo-router";
import { FolderKanban, Hourglass } from "lucide-react-native";

import { useClientOverview, usePortalProjects } from "@/features/clientPortal/useClientOverview";
import { ProfileView } from "@/features/settings/ProfileView";
import { StatTile } from "@/ui/StatTile";

export default function ClientProfileScreen() {
  const router = useRouter();
  const projects = usePortalProjects();
  const overview = useClientOverview();
  const open = overview.data ? [...overview.data.tasks, ...overview.data.meetings, ...overview.data.calls].filter((item) => item.status !== "completed").length : undefined;

  return (
    <ProfileView roleLabel="Client" settingsPath="/client/settings">
      <StatTile label="Shared projects" value={projects.data?.length ?? "–"} icon={FolderKanban} onPress={() => router.navigate("/client/projects")} />
      <StatTile label="Open activities" value={open ?? "–"} icon={Hourglass} onPress={() => router.navigate("/client/home")} />
    </ProfileView>
  );
}
