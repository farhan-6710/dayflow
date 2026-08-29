import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/admin/auth/constants/auth";
import { CLIENT_AUTH_HOME } from "@/features/client/constants/routes";

export function buildClientAuthUrl(
  formType: AuthFormType = AUTH_FORM_TYPES.login,
): string {
  const params = new URLSearchParams();
  params.set(AUTH_FORM_TYPE_PARAM, formType);
  return `${CLIENT_AUTH_HOME}?${params.toString()}`;
}
