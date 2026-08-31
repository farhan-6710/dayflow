import { useCallback, useState } from "react";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import type { Client } from "@/features/admin/clients-management/types/types";
import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/admin/clients-management/utils/clientFormUtils";
import {
  clientToFormValues,
  emptyClientFormValues,
  normalizeClientEmail,
  validateClientForm,
} from "@/features/admin/clients-management/utils/clientFormUtils";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/services/clientsService";
import { showToast } from "@/shared/utils/showToast";

type UseClientDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useClientDialog({ reload, setError }: UseClientDialogOptions) {
  const { user: admin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ClientFormValues>(emptyClientFormValues);

  const resetForm = useCallback(() => {
    setValues(emptyClientFormValues());
    setEditingClientId(null);
  }, []);

  const onFieldChange = useCallback((field: ClientFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((client: Client) => {
    setEditingClientId(client.id);
    setValues(clientToFormValues(client));
    setIsDialogOpen(true);
  }, []);

  const onActiveChange = useCallback((isActive: boolean) => {
    setValues((current) => ({ ...current, isActive }));
  }, []);

  const saveClient = useCallback(async () => {
    if (isSaving || !admin) {
      return;
    }

    const validationError = validateClientForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        companyName: values.companyName.trim(),
        clientName: values.clientName.trim() || null,
        email: normalizeClientEmail(values.email),
        mobileNumber: values.mobileNumber.trim() || null,
        secondaryContactName: values.secondaryContactName.trim() || null,
        secondaryContactNumber: values.secondaryContactNumber.trim() || null,
        websiteUrl: values.websiteUrl.trim() || null,
      };

      const companyName = values.companyName.trim();

      if (editingClientId) {
        await updateClient(editingClientId, {
          ...payload,
          isActive: values.isActive,
        });
        showToast("success", `"${companyName}" updated successfully.`);
      } else {
        await createClient(admin.id, payload);
        showToast("success", `"${companyName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save client.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingClientId, handleDialogOpenChange, isSaving, reload, setError, admin, values]);

  const removeClient = useCallback(async () => {
    if (!editingClientId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const companyName = values.companyName.trim();
      await deleteClient(editingClientId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${companyName}" removed successfully.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete client.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingClientId, handleDialogOpenChange, isSaving, reload, setError, values.companyName]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingClientId !== null,
      isSaving,
      values,
      onFieldChange,
      onActiveChange,
      onSave: saveClient,
      onDelete: editingClientId ? removeClient : undefined,
    },
  };
}
