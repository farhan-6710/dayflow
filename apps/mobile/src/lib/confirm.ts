import { Alert, Platform } from "react-native";

import { haptics } from "@/lib/haptics";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel: string;
  destructive?: boolean;
};

/** A native alert, so it also shows above an open sheet. */
export function confirm({ title, message, confirmLabel, destructive = true }: ConfirmOptions): Promise<boolean> {
  if (destructive) haptics.warning();
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? "destructive" : "default", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
