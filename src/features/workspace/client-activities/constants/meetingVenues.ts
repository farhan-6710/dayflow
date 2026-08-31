import type { ClientActivityMeetingVenue } from "@/features/workspace/client-activities/types/types";

export const CLIENT_ACTIVITY_MEETING_VENUES: ClientActivityMeetingVenue[] = [
  "client_location",
  "in_office",
  "online",
];

export const CLIENT_ACTIVITY_MEETING_VENUE_LABELS: Record<
  ClientActivityMeetingVenue,
  string
> = {
  client_location: "Client location",
  in_office: "In office",
  online: "Online",
};
