import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useAuth } from "@/shared/hooks/useAuth";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import type { PortalUserHeaderMenuProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
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
  const { displayName, initials, avatarUrl, email } = useUserDisplay();
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
      showToast("error", "Couldn't sign you out. Check your connection and try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      {/* Non-modal: a modal menu closing while the dialog opens leaves the page unclickable. */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full"
            aria-label={`Account menu for ${displayName}`}
          >
            <UserAvatar src={avatarUrl} initials={initials} alt="" className="size-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-60">
          <DropdownMenuLabel className="grid font-normal">
            <span className="truncate text-sm text-foreground">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={settingsPath}>
              <Settings aria-hidden="true" />
              Account settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
            <LogOut aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Sign out?"
        description="You'll need to sign in again to get back to your account."
        confirmLabel="Sign out"
        loading={signingOut}
        onConfirm={handleSignOut}
      />
    </>
  );
}
