import { Bell } from "lucide-react";
import { Link } from "react-router";

import { WORKSPACE_NOTIFICATIONS_PATH } from "@/app/constants/workspaceRoutes";
import { Button } from "@/shared/ui/button";

// The unread badge arrives with the notifications feature (Phase 4).
export function NotificationsHeaderButton() {
  return (
    <Button asChild variant="ghost" size="icon-lg" aria-label="Open notifications">
      <Link to={WORKSPACE_NOTIFICATIONS_PATH}>
        <Bell aria-hidden="true" />
      </Link>
    </Button>
  );
}
