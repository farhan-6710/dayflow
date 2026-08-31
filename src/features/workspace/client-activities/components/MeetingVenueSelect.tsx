import { useMemo } from "react";

import {
  CLIENT_ACTIVITY_MEETING_VENUE_LABELS,
  CLIENT_ACTIVITY_MEETING_VENUES,
} from "@/features/workspace/client-activities/constants/meetingVenues";
import type { ClientActivityMeetingVenue } from "@/features/workspace/client-activities/types/types";
import { OptionDropdown } from "@/shared/components/OptionDropdown";

type MeetingVenueSelectProps = {
  value: ClientActivityMeetingVenue;
  onChange: (venue: ClientActivityMeetingVenue) => void;
  disabled?: boolean;
};

export function MeetingVenueSelect({
  value,
  onChange,
  disabled = false,
}: MeetingVenueSelectProps) {
  const options = useMemo(
    () =>
      CLIENT_ACTIVITY_MEETING_VENUES.map((venue) => ({
        value: venue,
        label: CLIENT_ACTIVITY_MEETING_VENUE_LABELS[venue],
      })),
    [],
  );

  return (
    <OptionDropdown
      value={value}
      onChange={(next) => onChange(next as ClientActivityMeetingVenue)}
      options={options}
      disabled={disabled}
      placeholder="Select venue"
    />
  );
}
