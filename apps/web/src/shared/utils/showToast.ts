import { toast, type ExternalToast } from "sonner";

export type ToastType = "success" | "error" | "info";

export function showToast(type: ToastType, message: string, options?: ExternalToast) {
  toast[type](message, options);
}
