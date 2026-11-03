import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type { Client, Project } from "@/shared/types/types";

import type { ClientChatMessage } from "@/features/workspace/clients-management/types/types";

export type ClientsTableProps = {
  clients: Client[];
  isFiltered: boolean;
  isLoading: boolean;
  statusFilter: ActiveStatusFilterId;
  onStatusFilterChange: (filter: ActiveStatusFilterId) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onCreate: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

export type ClientsTableRowProps = {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

export type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates a new client. */
  client: Client | null;
  onSaved: (client: Client) => void;
};

export type ClientSummaryProps = {
  client: Client;
};

export type ClientProjectsSectionProps = {
  projects: Project[];
  canAdd: boolean;
  onAdd: () => void;
};

export type ClientChatProps = {
  clientId: string;
  clientLabel: string;
  messages: ClientChatMessage[];
  onMessagesChange: (update: (messages: ClientChatMessage[]) => ClientChatMessage[]) => void;
};

export type ClientChatMessageRowProps = {
  message: ClientChatMessage;
  clientLabel: string;
  isOwn: boolean;
  disabled: boolean;
  onEdit: (message: ClientChatMessage) => void;
  onDelete: (message: ClientChatMessage) => void;
};
