import { AUTH_FORM_TYPE_PARAM, type AuthFormType } from "@/shared/constants/auth";

export function buildAuthUrl(authPath: string, formType: AuthFormType): string {
  const params = new URLSearchParams({ [AUTH_FORM_TYPE_PARAM]: formType });
  return `${authPath}?${params.toString()}`;
}
