export type ThemePreference = "light" | "dark";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  theme_preference: ThemePreference;
  created_at: string;
  updated_at: string;
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
