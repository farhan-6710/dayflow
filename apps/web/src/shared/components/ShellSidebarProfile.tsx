import { ChevronsUpDown } from "lucide-react";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { cn } from "@/shared/lib/utils";
import { usePageTransition } from "@/shared/providers/pageTransitionContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import {
  getInitialsFromName,
  getUserAvatarUrl,
  getUserEmail,
  getWorkspaceDisplayName,
} from "@/shared/utils/authUserDisplay";
import { routePath } from "@/shared/utils/routePath";

type ShellSidebarProfileProps = {
  to: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

export function ShellSidebarProfile({ to, collapsed, onNavigate }: ShellSidebarProfileProps) {
  const { user, profile } = useAuth();
  const { activePath } = usePageTransition();
  const isActive = routePath(to) === routePath(activePath);

  const displayName = getWorkspaceDisplayName(user, profile?.display_name);
  const email = getUserEmail(user);
  const initials = getInitialsFromName(displayName);
  const avatarUrl = profile?.avatar_url || getUserAvatarUrl(user);

  const link = (
    <TransitionLink
      to={to}
      onClick={onNavigate}
      aria-label={`Open settings for ${displayName}`}
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-md text-left text-sm transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed ? "size-9 justify-center p-0" : "h-12 p-2",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <div className="size-8 shrink-0 overflow-hidden rounded-lg">
        <UserAvatar
          src={avatarUrl}
          name={displayName}
          initials={initials}
          alt=""
          imgClassName="rounded-lg"
          initialsClassName="rounded-lg bg-accent text-xs text-accent-foreground"
        />
      </div>

      {collapsed ? (
        <span className="sr-only">{displayName}</span>
      ) : (
        <>
          <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </span>
          <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </>
      )}
    </TransitionLink>
  );

  return (
    <div className="w-full">
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">{link}</div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
    </div>
  );
}
