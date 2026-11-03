import { useState, type FormEvent } from "react";

import type { ClientDialogProps } from "@/features/workspace/clients-management/types/components";
import { createClient, updateClient } from "@/services/clientsService";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Client } from "@/shared/types/types";
import { useUnsavedDialogClose } from "@/shared/unsaved-changes/useUnsavedDialogClose";
import { showToast } from "@/shared/utils/showToast";

function toFormValues(client: Client | null) {
  return {
    companyName: client?.company_name ?? "",
    clientName: client?.client_name ?? "",
    mobileNumber: client?.mobile_number ?? "",
    email: client?.email ?? "",
    secondaryContactName: client?.secondary_contact_name ?? "",
    secondaryContactNumber: client?.secondary_contact_number ?? "",
    websiteUrl: client?.website_url ?? "",
    isActive: client?.is_active ?? true,
  };
}

export type ClientFormValues = ReturnType<typeof toFormValues>;

export function useClientForm({ open, onOpenChange, client, onSaved }: ClientDialogProps) {
  const { user } = useAuth();
  const initial = toFormValues(client);
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(initial);
    }
  }

  /** Throws on failure so the unsaved-changes modal stays open. */
  async function save() {
    const email = values.email.trim();
    const problem = !values.companyName.trim()
      ? "Enter the company or brand name."
      : email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : null;
    if (problem || !user) {
      showToast("error", problem ?? "You're signed out. Sign in and try again.");
      throw new Error(problem ?? "Not signed in.");
    }

    const { isActive, ...fields } = values;
    const input = { ...fields, companyName: fields.companyName.trim() };
    setSaving(true);
    try {
      const saved = client ? await updateClient(client.id, { ...input, isActive }) : await createClient(user.id, input);
      onSaved(saved);
      onOpenChange(false);
      showToast("success", client ? "Client updated." : "Client added.");
    } catch (error) {
      console.error("Failed to save client:", error);
      showToast("error", error instanceof Error ? error.message : "Couldn't save the client. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const { handleOpenChange } = useUnsavedDialogClose({
    id: "client-dialog",
    open,
    isDirty: JSON.stringify(values) !== JSON.stringify(initial),
    isCreate: !client,
    onOpenChange,
    onSave: save,
  });

  function setField<K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save().catch(() => undefined);
  }

  return { values, setField, saving, handleOpenChange, handleSubmit };
}
