import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

import { CLIENTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/workspace/clients-management/constants/clientsDirectory";
import { buildClientDetailPath } from "@/features/workspace/clients-management/constants/routes";
import type { ClientsTableRowProps } from "@/features/workspace/clients-management/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function ClientTableCell({
  label,
  children,
  className,
  title,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={cn("min-w-0 overflow-hidden text-sm text-muted-foreground", className)}
      title={title}
    >
      <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
        {label}
      </span>
      {children}
    </div>
  );
}

function TruncatedText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={cn("block truncate", className)} title={value}>
      {value}
    </span>
  );
}

function EmptyCell() {
  return <span className="text-muted-foreground/50">—</span>;
}

export function ClientsTableRow({
  client,
  onEditClient,
}: ClientsTableRowProps) {
  const website = client.website_url?.trim();
  const companyName = client.company_name.trim();
  const clientName = client.client_name?.trim();
  const mobile = client.mobile_number?.trim();
  const email = client.email?.trim();

  return (
    <DirectoryTableRow
      to={buildClientDetailPath(client.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        CLIENTS_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <ClientTableCell
        label="COMPANY / BRAND"
        className="font-medium text-foreground"
        title={companyName}
      >
        <TruncatedText value={companyName} />
      </ClientTableCell>

      <ClientTableCell label="CLIENT NAME" title={clientName ?? undefined}>
        {clientName ? <TruncatedText value={clientName} /> : <EmptyCell />}
      </ClientTableCell>

      <ClientTableCell label="MOBILE" title={mobile ?? undefined}>
        {mobile ? <TruncatedText value={mobile} /> : <EmptyCell />}
      </ClientTableCell>

      <ClientTableCell label="EMAIL" title={email ?? undefined}>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="block truncate text-primary hover:underline"
            title={email}
            onClick={stopDirectoryRowNav}
          >
            {email}
          </a>
        ) : (
          <EmptyCell />
        )}
      </ClientTableCell>

      <ClientTableCell label="WEBSITE" title={website ?? undefined}>
        {website ? (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-primary hover:underline"
            title={website}
            onClick={stopDirectoryRowNav}
          >
            {website}
          </a>
        ) : (
          <EmptyCell />
        )}
      </ClientTableCell>

      <div className="min-w-0">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        <ActiveStatusLabel isActive={client.is_active} />
      </div>

      <div className="flex shrink-0 justify-end gap-2 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={(event) => {
            stopDirectoryRowNav(event);
            onEditClient(client);
          }}
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit Client</span>
        </Button>
      </div>
    </DirectoryTableRow>
  );
}
