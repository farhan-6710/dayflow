import { useState } from "react";
import { ChevronDown, CircleHelp, LogOut, Settings, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { SUPPORT_URL } from "@/shared/constants/support";
import { useAuth } from "@/shared/hooks/useAuth";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import type { PortalUserHeaderMenuProps } from "@/shared/types/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { showToast } from "@/shared/utils/showToast";

export function PortalUserHeaderMenu({ settingsPath, signOutRedirect }: PortalUserHeaderMenuProps) {
  const { signOut } = useAuth();
  const { displayName, firstName, initials, avatarUrl, email } = useUserDisplay();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      setConfirmOpen(false);
      void navigate(signOutRedirect, { replace: true });
    } catch (error) {
      console.error("Sign out failed:", error);
      showToast("error", "Couldn't log you out. Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      {/* Non-modal: a modal menu closing while the dialog opens leaves the page unclickable. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label={`Account menu for ${displayName}`}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card p-1 transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:pr-2.5"
        >
          <UserAvatar src={avatarUrl} initials={initials} alt="" className="size-8" />
          <span className="hidden max-w-28 truncate text-sm sm:inline">{firstName}</span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-60">
          <DropdownMenuLabel className="grid font-normal">
            <span className="truncate text-sm text-foreground">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={settingsPath}>
              <UserRound aria-hidden="true" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={settingsPath}>
              <Settings aria-hidden="true" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
              <CircleHelp aria-hidden="true" />
              Help & support
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
            <LogOut className="text-destructive" aria-hidden="true" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Log out?"
        description="You'll need to sign in again to get back to your account."
        confirmLabel="Log Out"
        loading={signingOut}
        onConfirm={handleSignOut}
      />
    </>
  );
}
