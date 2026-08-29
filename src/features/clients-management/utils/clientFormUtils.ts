import type { Client } from "@/features/clients-management/types/types";

export type ClientFormValues = {
  companyName: string;
  clientName: string;
  mobileNumber: string;
  email: string;
  secondaryContactName: string;
  secondaryContactNumber: string;
  websiteUrl: string;
  isActive: boolean;
};

export type ClientFormField = keyof Omit<ClientFormValues, "isActive">;

export const emptyClientFormValues = (): ClientFormValues => ({
  companyName: "",
  clientName: "",
  mobileNumber: "",
  email: "",
  secondaryContactName: "",
  secondaryContactNumber: "",
  websiteUrl: "",
  isActive: true,
});

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    companyName: client.company_name,
    clientName: client.client_name ?? "",
    mobileNumber: client.mobile_number ?? "",
    email: client.email ?? "",
    secondaryContactName: client.secondary_contact_name ?? "",
    secondaryContactNumber: client.secondary_contact_number ?? "",
    websiteUrl: client.website_url ?? "",
    isActive: client.is_active ?? true,
  };
}

export function validateClientForm(values: ClientFormValues): string | null {
  if (!values.companyName.trim()) {
    return "Company / brand name is required.";
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email.";
  }

  return null;
}

export function normalizeClientEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}
