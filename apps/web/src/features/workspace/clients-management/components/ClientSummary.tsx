import { Globe, Info, KeyRound, Mail, Phone, User, UserPlus } from "lucide-react";

import type { ClientSummaryProps } from "@/features/workspace/clients-management/types/components";
import { DetailsPanel } from "@/shared/components/DetailsPanel";
import { safeExternalHref } from "@/shared/utils/safeExternalHref";

const LINK_CLASS = "underline-offset-4 hover:underline";

export function ClientSummary({ client }: ClientSummaryProps) {
  const websiteHref = client.website_url ? safeExternalHref(client.website_url) : undefined;
  const secondary = [client.secondary_contact_name, client.secondary_contact_number].filter(Boolean).join(" · ");
  const rows = [
    { icon: User, label: "Contact", value: client.client_name },
    {
      icon: Mail,
      label: "Email",
      value: client.email ? (
        <a href={`mailto:${client.email}`} className={LINK_CLASS}>
          {client.email}
        </a>
      ) : null,
    },
    {
      icon: Phone,
      label: "Mobile",
      value: client.mobile_number ? (
        <a href={`tel:${client.mobile_number}`} className={LINK_CLASS}>
          {client.mobile_number}
        </a>
      ) : null,
    },
    { icon: UserPlus, label: "Secondary", value: secondary },
    {
      icon: Globe,
      label: "Website",
      value:
        client.website_url && websiteHref ? (
          <a href={websiteHref} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {client.website_url}
          </a>
        ) : (
          client.website_url
        ),
    },
    { icon: KeyRound, label: "Portal Access", value: client.auth_user_id ? "Signed in before" : "Not signed in yet" },
  ];

  return (
    <DetailsPanel
      icon={Info}
      title="Client Details"
      rows={rows.map((row) => ({ ...row, value: row.value || <span className="text-muted-foreground">Not added</span> }))}
    />
  );
}
