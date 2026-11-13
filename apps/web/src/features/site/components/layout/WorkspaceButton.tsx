import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import type { WorkspaceButtonProps } from "@/features/site/types/components";
import { Button } from "@/shared/ui/button";

/** Header call to action. The workspace is guarded, so signed-out visitors land on its sign-in page. */
export function WorkspaceButton({ className, onClick }: WorkspaceButtonProps) {
  return (
    <Button asChild size="lg" className={className}>
      <Link to={WORKSPACE_DASHBOARD_PATH} onClick={onClick}>
        <LayoutDashboard aria-hidden="true" />
        Open Workspace
      </Link>
    </Button>
  );
}
