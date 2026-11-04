import { Link } from "react-router";

import { UserAvatar } from "@/shared/components/UserAvatar";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import { cn } from "@/shared/lib/utils";
import type { ShellSidebarProfileProps } from "@/shared/types/components";

export function ShellSidebarProfile({ profilePath, collapsed, onNavigate }: ShellSidebarProfileProps) {
  const { displayName, initials, avatarUrl, email } = useUserDisplay();

  return (
    <Link
      to={profilePath}
      onClick={onNavigate}
      aria-label={collapsed ? `${displayName}, open settings` : undefined}
      className={cn(
        "flex h-12 items-center gap-2.5 rounded-lg transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
        collapsed ? "justify-center" : "px-3",
      )}
    >
      <UserAvatar src={avatarUrl} initials={initials} alt="" className="size-9" />
      {collapsed ? null : (
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-sm">{displayName}</span>
          <span className="truncate text-xs text-sidebar-foreground/70">{email}</span>
        </span>
      )}
    </Link>
  );
}
