import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/clients-management/utils/clientFormUtils";
import type { Client } from "@/features/clients-management/types/types";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";

export type ClientsTableRowProps = {
  client: Client;
  onEditClient: (client: Client) => void;
};

export type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientFormValues;
  onFieldChange: (field: ClientFormField, value: string) => void;
  onActiveChange: (isActive: boolean) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export type ClientsTableProps = {
  clients: Client[];
  isLoading: boolean;
  onEditClient: (client: Client) => void;
  statusFilter: ActiveStatusFilterId;
  onStatusFilterChange: (filter: ActiveStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export type ClientDialogBasicFieldsProps = {
  values: ClientFormValues;
  onFieldChange: (field: ClientFormField, value: string) => void;
  disabled?: boolean;
};
