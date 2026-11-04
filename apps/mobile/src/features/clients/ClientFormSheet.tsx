import { useEffect, useMemo, useState } from "react";

import { isValidEmail } from "@/features/auth/validation";
import { useClientActions } from "@/features/clients/useClients";
import type { Client } from "@/shared/types/types";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { SwitchRow } from "@/ui/SwitchRow";

type ClientFormSheetProps = {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
};

export function ClientFormSheet({ open, onClose, client }: ClientFormSheetProps) {
  const { create, update } = useClientActions();
  const initial = useMemo(
    () => ({
      companyName: client?.company_name ?? "",
      clientName: client?.client_name ?? "",
      mobileNumber: client?.mobile_number ?? "",
      email: client?.email ?? "",
      secondaryContactName: client?.secondary_contact_name ?? "",
      secondaryContactNumber: client?.secondary_contact_number ?? "",
      websiteUrl: client?.website_url ?? "",
      isActive: client?.is_active ?? true,
    }),
    [client],
  );
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const emailError = form.email.trim() && !isValidEmail(form.email) ? "Enter a valid email address." : null;
  const set = (key: keyof typeof form) => (value: string) => setForm({ ...form, [key]: value });

  async function submit() {
    const input = { ...form, companyName: form.companyName.trim() };
    if (client) await update.mutateAsync({ id: client.id, input });
    else await create.mutateAsync(input);
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={client ? "Edit client" : "New client"}
      submitLabel={client ? "Save client" : "Add client"}
      onSubmit={submit}
      dirty={JSON.stringify(form) !== JSON.stringify(initial)}
      canSubmit={Boolean(form.companyName.trim()) && !emailError}
    >
      <Input label="Company name" value={form.companyName} onChangeText={set("companyName")} placeholder="Company" autoFocus={!client} />
      <Input label="Client name" value={form.clientName} onChangeText={set("clientName")} placeholder="Main contact" autoComplete="name" />
      <Input label="Mobile" value={form.mobileNumber} onChangeText={set("mobileNumber")} keyboardType="phone-pad" placeholder="Phone number" />
      <Input label="Email" value={form.email} onChangeText={set("email")} autoCapitalize="none" keyboardType="email-address" placeholder="name@company.com" error={emailError} hint="This is how they sign in to the client portal." />
      <Input label="Secondary contact name" value={form.secondaryContactName} onChangeText={set("secondaryContactName")} placeholder="Optional" />
      <Input label="Secondary contact number" value={form.secondaryContactNumber} onChangeText={set("secondaryContactNumber")} keyboardType="phone-pad" placeholder="Optional" />
      <Input label="Website" value={form.websiteUrl} onChangeText={set("websiteUrl")} autoCapitalize="none" keyboardType="url" placeholder="https://" />
      {client ? <SwitchRow label="Active" value={form.isActive} onChange={(isActive) => setForm({ ...form, isActive })} /> : null}
    </FormSheet>
  );
}
