import { InboxList } from "@/features/notifications/InboxList";
import { Screen, TabHeader } from "@/ui/Screen";

export default function ClientAlertsScreen() {
  return (
    <Screen>
      <TabHeader title="Alerts" />
      <InboxList />
    </Screen>
  );
}
