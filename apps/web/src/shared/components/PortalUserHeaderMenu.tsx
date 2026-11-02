import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { AUTH_HOME } from "@/features/workspace/auth/constants/routes";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { UserAvatar } from "@/shared/components/UserAvatar";
import {
  getInitialsFromName,
  getUserAvatarUrl,
  getUserEmail,
  getWorkspaceDisplayName,
} from "@/shared/utils/authUserDisplay";

const avatarInitialsClassName =
  "rounded-full bg-[color-mix(in_srgb,var(--tint)_42%,var(--card))] text-[0.65rem] font-semibold text-foreground";
import type { PortalUserHeaderMenuProps } from "@/shared/types/components";

export function PortalUserHeaderMenu({
  accountPath,
  settingsPath,
  signOutRedirect = AUTH_HOME,
}: PortalUserHeaderMenuProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = getWorkspaceDisplayName(user, profile?.display_name);
  const initials = getInitialsFromName(displayName);
  const avatarUrl = profile?.avatar_url || getUserAvatarUrl(user);
  const email = getUserEmail(user);
  const firstName = displayName.split(/\s+/)[0] || displayName;

  async function handleConfirmSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      setSignOutOpen(false);
      navigate(signOutRedirect, { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Account menu for ${displayName}`}
            className="surface-chip inline-flex h-9 max-w-[14rem] items-center gap-2 rounded-full py-1 pr-2.5 pl-1 text-left transition-[filter,transform] hover:brightness-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="size-7 shrink-0 overflow-hidden rounded-full">
              <UserAvatar
                src={avatarUrl}
                name={displayName}
                initials={initials}
                alt=""
                initialsClassName={avatarInitialsClassName}
              />
            </span>
            <span className="hidden min-w-0 truncate text-sm font-medium sm:inline">
              {firstName}
            </span>
            <ChevronDown className="hidden size-3.5 shrink-0 text-muted-foreground sm:block" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-xl">
          <DropdownMenuLabel className="flex items-center gap-2.5 font-normal">
            <span className="size-8 shrink-0 overflow-hidden rounded-full">
              <UserAvatar
                src={avatarUrl}
                name={displayName}
                initials={initials}
                alt=""
                initialsClassName={avatarInitialsClassName}
              />
            </span>
            <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-foreground">{displayName}</span>
              {email ? (
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              ) : null}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to={accountPath} className="flex items-center gap-2">
              <User className="size-4" />
              Account
            </Link>
          </DropdownMenuItem>

          {settingsPath ? (
            <DropdownMenuItem asChild>
              <Link to={settingsPath} className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setSignOutOpen(true);
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign out?"
        description="You will need to log in again to access your dashboard or client portal."
        confirmLabel="Sign out"
        confirmVariant="destructive"
        loading={signingOut}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
