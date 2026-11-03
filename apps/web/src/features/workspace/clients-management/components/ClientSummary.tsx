import type { ClientSummaryProps } from "@/features/workspace/clients-management/types/components";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { safeExternalHref } from "@/shared/utils/safeExternalHref";

export function ClientSummary({ client }: ClientSummaryProps) {
  const websiteHref = client.website_url ? safeExternalHref(client.website_url) : undefined;
  const secondary = [client.secondary_contact_name, client.secondary_contact_number].filter(Boolean).join(" · ");
  const fields = [
    { label: "Contact", value: client.client_name },
    {
      label: "Email",
      value: client.email ? (
        <a href={`mailto:${client.email}`} className="underline-offset-4 hover:underline">
          {client.email}
        </a>
      ) : null,
    },
    {
      label: "Mobile",
      value: client.mobile_number ? (
        <a href={`tel:${client.mobile_number}`} className="underline-offset-4 hover:underline">
          {client.mobile_number}
        </a>
      ) : null,
    },
    { label: "Secondary contact", value: secondary },
    {
      label: "Website",
      value:
        client.website_url && websiteHref ? (
          <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            {client.website_url}
          </a>
        ) : (
          client.website_url
        ),
    },
    { label: "Portal access", value: client.auth_user_id ? "Signed in before" : "Not signed in yet" },
  ];

  return (
    <section className={cn(panelClassName, "min-w-0 p-5")}>
      <h2 className="text-xl">Details</h2>
      <dl className="mt-3 grid gap-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{field.label}</dt>
            <dd className="text-sm break-words">{field.value || "Not added"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
