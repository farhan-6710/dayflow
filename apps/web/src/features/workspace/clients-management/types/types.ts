export type ClientChatMessageAuthorUser = {
  display_name: string | null;
};

export type ClientChatMessageAuthorClient = {
  company_name: string;
  client_name: string | null;
};

export type ClientChatMessage = {
  id: string;
  client_id: string;
  author_user_id: string | null;
  author_client_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  author_user?: ClientChatMessageAuthorUser | ClientChatMessageAuthorUser[] | null;
  author_client?: ClientChatMessageAuthorClient | ClientChatMessageAuthorClient[] | null;
};

export type Client = {
  id: string;
  owner_user_id: string;
  company_name: string;
  client_name: string | null;
  mobile_number: string | null;
  email: string | null;
  secondary_contact_name: string | null;
  secondary_contact_number: string | null;
  website_url: string | null;
  is_active: boolean;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
};
