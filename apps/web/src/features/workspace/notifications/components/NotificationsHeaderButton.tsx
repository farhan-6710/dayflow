import { Bell } from "lucide-react";
import { Link } from "react-router";

import { WORKSPACE_NOTIFICATIONS_PATH } from "@/app/constants/workspaceRoutes";
import { useUnreadNotificationsCount } from "@/shared/hooks/useUnreadNotificationsCount";
import { Button } from "@/shared/ui/button";

export function NotificationsHeaderButton() {
  const count = useUnreadNotificationsCount();

  return (
    <Button
      asChild
      variant="ghost"
      size="icon-lg"
      className="relative"
      aria-label={count > 0 ? `Open notifications, ${count} unread` : "Open notifications"}
    >
      <Link to={WORKSPACE_NOTIFICATIONS_PATH}>
        <Bell aria-hidden="true" />
        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute top-0.5 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] leading-none text-primary-foreground tabular-nums"
          >
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
