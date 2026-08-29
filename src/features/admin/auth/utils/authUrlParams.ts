import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/admin/auth/constants/auth";
import { AUTH_HOME } from "@/features/admin/auth/constants/routes";

export function buildAuthUrl(
  formType: AuthFormType = AUTH_FORM_TYPES.login,
): string {
  const params = new URLSearchParams();
  params.set(AUTH_FORM_TYPE_PARAM, formType);
  return `${AUTH_HOME}?${params.toString()}`;
}
