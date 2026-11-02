import { ChevronRight } from "lucide-react";
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
        "flex items-center rounded-[1rem] transition",
        collapsed ? "justify-center p-1.5" : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <div
        className={cn(
          "size-9 shrink-0 overflow-hidden rounded-full border",
          isActive ? "border-tint/40" : "border-border",
        )}
      >
        <UserAvatar
          src={avatarUrl}
          name={displayName}
          initials={initials}
          alt=""
          initialsClassName="rounded-full bg-[color-mix(in_srgb,var(--tint)_42%,var(--card))] text-xs font-semibold text-foreground"
        />
      </div>

      {collapsed ? (
        <span className="sr-only">{displayName}</span>
      ) : (
        <>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold leading-tight">{displayName}</div>
            <div className={cn("mt-0.5 truncate text-xs leading-tight", "text-muted-foreground")}>
              {email}
            </div>
          </div>
          <ChevronRight
            className={cn("size-4 shrink-0", "text-muted-foreground")}
            aria-hidden="true"
          />
        </>
      )}
    </TransitionLink>
  );

  return (
    <div className="shrink-0 border-t border-sidebar-border/80 p-3">
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
