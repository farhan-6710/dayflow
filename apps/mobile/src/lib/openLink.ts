import { Linking } from "react-native";

import { safeExternalHref } from "@/shared/utils/safeExternalHref";
import { showToast } from "@/ui/Toaster";

/** Stored links are free text, so only web and mail links may open. */
export async function openLink(url: string) {
  const href = safeExternalHref(url);
  if (!href) {
    showToast("error", "That link can't be opened.");
    return;
  }
  try {
    await Linking.openURL(href);
  } catch {
    showToast("error", "That link can't be opened.");
  }
}
