import { useRouter } from "expo-router";
import { CalendarClock, FolderKanban, Hourglass } from "lucide-react-native";

import { useProjects } from "@/features/projects/useProjects";
import { useReminders } from "@/features/reminders/useReminders";
import { ProfileView } from "@/features/settings/ProfileView";
import { useTasks } from "@/features/tasks/useTasks";
import { StatTile } from "@/ui/StatTile";

export default function ProfileScreen() {
  const router = useRouter();
  const tasks = useTasks();
  const projects = useProjects();
  const reminders = useReminders();
  const pending = tasks.data?.filter((task) => task.status !== "done" && task.status !== "missed").length;

  return (
    <ProfileView roleLabel="Workspace owner" settingsPath="/settings">
      <StatTile label="Pending tasks" value={pending ?? "–"} icon={Hourglass} onPress={() => router.navigate("/calendar")} />
      <StatTile label="Projects" value={projects.data?.length ?? "–"} icon={FolderKanban} onPress={() => router.navigate("/projects")} />
      <StatTile label="Reminders" value={reminders.data?.length ?? "–"} icon={CalendarClock} onPress={() => router.push("/reminders")} />
    </ProfileView>
  );
}
