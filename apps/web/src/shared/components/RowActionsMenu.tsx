import { MoreVertical } from "lucide-react";

import type { RowActionsMenuProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";

/** Kebab menu for a list row. Clicks stay here (menu portals still bubble through React) so the row doesn't open. */
export function RowActionsMenu({ label, actions }: RowActionsMenuProps) {
  return (
    <div onClick={stopDirectoryRowNav} onKeyDown={(event) => event.stopPropagation()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-lg" className="text-muted-foreground" aria-label={label}>
            <MoreVertical aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map(({ label: actionLabel, icon: Icon, destructive, onSelect }) => (
            <DropdownMenuItem
              key={actionLabel}
              variant={destructive ? "destructive" : "default"}
              onSelect={onSelect}
              className="data-[variant=destructive]:text-foreground data-[variant=destructive]:focus:text-foreground"
            >
              <Icon aria-hidden="true" />
              {actionLabel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
