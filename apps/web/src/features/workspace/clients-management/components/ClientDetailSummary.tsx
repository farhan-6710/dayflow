import { format } from "date-fns";
import type { ReactNode } from "react";

import type { ClientDetailSummaryProps } from "@/features/workspace/clients-management/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { raisedStaticPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="surface-chip flex items-start justify-between gap-4 rounded-[0.8rem] px-4 py-3">
      <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
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
          className="text-primary-text hover:underline"
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
          className="text-primary-text hover:underline"
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
    <div className={cn("flex h-full flex-col", raisedStaticPanelClassName)}>
      <div className="px-5 pt-5 pb-4">
        <h2 className="pl-1 text-2xl leading-none font-bold">Client details</h2>
        <p className="mt-2 pl-1 text-sm text-foreground/75">
          Primary contact for{" "}
          <span className="font-medium">{clientContactLabel}</span>
          {client.company_name !== clientContactLabel
            ? ` at ${client.company_name}.`
            : "."}
        </p>
      </div>

      <div className="space-y-2.5 px-5 pb-5">{details.map((detail) => (
          <DetailRow key={detail.label} label={detail.label} value={detail.value} />
        ))}</div>
    </div>
  );
}
