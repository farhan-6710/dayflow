import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "dayflow:reminder-alerts";

/** Reminder alerts are on unless turned off on this device. */
export async function getReminderAlertsEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY)) !== "off";
}

export async function setReminderAlertsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEY, enabled ? "on" : "off");
}
