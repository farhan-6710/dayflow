import { useRouter } from "expo-router";

import { InboxList } from "@/features/notifications/InboxList";
import { BackHeader, Screen } from "@/ui/Screen";

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <Screen>
      <BackHeader title="Notifications" />
      <InboxList
        onOpen={(item) => {
          if (item.notification_type === "reminder" && item.related_id) router.push(`/reminder-details/${item.related_id}`);
          else if (item.notification_type === "task") router.navigate("/calendar");
        }}
      />
    </Screen>
  );
}
