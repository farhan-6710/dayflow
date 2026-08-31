import { format } from "date-fns";
import type { ReactNode } from "react";

import type { ClientDetailSummaryProps } from "@/features/admin/clients-management/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3 sm:px-6">
      <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-medium break-words text-foreground">
        {value}
      </span>
    </div>
  );
}

function EmptyValue() {
  return <span className="text-muted-foreground">—</span>;
}

export function ClientDetailSummary({ client }: ClientDetailSummaryProps) {
  const website = client.website_url?.trim();
  const clientContactLabel =
    client.client_name?.trim() || client.company_name.trim();

  const details: Array<{ label: string; value: ReactNode }> = [
    { label: "Company / brand", value: client.company_name },
    {
      label: "Client name",
      value: client.client_name?.trim() || <EmptyValue />,
    },
    {
      label: "Mobile",
      value: client.mobile_number?.trim() || <EmptyValue />,
    },
    {
      label: "Email",
      value: client.email ? (
        <a
          href={`mailto:${client.email}`}
          className="text-primary hover:underline"
          onClick={stopDirectoryRowNav}
        >
          {client.email}
        </a>
      ) : (
        <EmptyValue />
      ),
    },
    {
      label: "Secondary contact",
      value: client.secondary_contact_name?.trim() || <EmptyValue />,
    },
    {
      label: "Secondary number",
      value: client.secondary_contact_number?.trim() || <EmptyValue />,
    },
    {
      label: "Website",
      value: website ? (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          onClick={stopDirectoryRowNav}
        >
          {website}
        </a>
      ) : (
        <EmptyValue />
      ),
    },
    {
      label: "Status",
      value: <ActiveStatusLabel isActive={client.is_active} />,
    },
    {
      label: "Created",
      value: format(new Date(client.created_at), "MMM d, yyyy"),
    },
    {
      label: "Updated",
      value: format(new Date(client.updated_at), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Client details
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Primary contact for{" "}
          <span className="font-medium">{clientContactLabel}</span>
          {client.company_name !== clientContactLabel
            ? ` at ${client.company_name}.`
            : "."}
        </p>
      </div>

      <div className="divide-y divide-border">{details.map((detail) => (
          <DetailRow key={detail.label} label={detail.label} value={detail.value} />
        ))}</div>
    </div>
  );
}
