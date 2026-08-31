import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/workspace/clients-management/utils/clientFormUtils";
import type {
  Client,
  ClientChatMessage,
} from "@/features/workspace/clients-management/types/types";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";

export type ClientDetailSummaryProps = {
  client: Client;
};

export type ClientChatMessageProps = {
  message: ClientChatMessage;
  isMine: boolean;
  authorLabel: string;
  isEditing: boolean;
  canManage?: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export type ClientChatProps = {
  clientContactLabel: string;
  currentUserId: string;
  messages: ClientChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRefresh: () => void;
  isSending: boolean;
  isRefreshing?: boolean;
  editingMessageId?: string | null;
  onEditMessage?: (message: ClientChatMessage) => void;
  onCancelEdit?: () => void;
  onDeleteMessage?: (messageId: string) => void;
  deleteConfirmOpen?: boolean;
  onDeleteConfirmOpenChange?: (open: boolean) => void;
  onConfirmDelete?: () => void;
  isDeleting?: boolean;
};

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
