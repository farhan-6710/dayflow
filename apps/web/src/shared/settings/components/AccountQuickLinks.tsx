import { CalendarClock, FolderKanban, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router";

import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

type AccountQuickLinksProps = {
  homePath: string;
  tasksPath: string;
  projectsPath: string;
  settingsPath: string;
};

const links = [
  { key: "home", label: "Dashboard", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks", icon: CalendarClock },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

export function AccountQuickLinks({
  homePath,
  tasksPath,
  projectsPath,
  settingsPath,
}: AccountQuickLinksProps) {
  const hrefs = {
    home: homePath,
    tasks: tasksPath,
    projects: projectsPath,
    settings: settingsPath,
  };

  return (
    <Reveal as="section" className={cn(panelClassName, "p-5")}>
      <h2 className="text-xl">Quick links</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jump back into your workspace.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {links.map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            to={hrefs[key]}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
