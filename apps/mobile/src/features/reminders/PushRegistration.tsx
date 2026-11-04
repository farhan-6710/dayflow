import { useRegisterDFN } from "@notifications/hooks/useRegisterDFN";

/** Saves this device's push token for the signed-in account, through the preserved hook. */
export function PushRegistration() {
  useRegisterDFN();
  return null;
}
