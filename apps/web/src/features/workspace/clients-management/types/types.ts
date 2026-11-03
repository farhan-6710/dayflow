export type ClientChatMessage = {
  id: string;
  client_id: string;
  author_user_id: string | null;
  author_client_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  author_user?: { display_name: string | null } | { display_name: string | null }[] | null;
  author_client?:
    | { company_name: string; client_name: string | null }
    | { company_name: string; client_name: string | null }[]
    | null;
};
