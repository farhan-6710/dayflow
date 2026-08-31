import { useMemo } from "react";

import {
  CLIENT_ACTIVITY_STATUS_LABELS,
  CLIENT_ACTIVITY_STATUSES,
} from "@/features/admin/client-activities/constants/activityStatuses";
import type { ClientActivityStatus } from "@/features/admin/client-activities/types/types";
import { OptionDropdown } from "@/shared/components/OptionDropdown";

type ActivityStatusSelectProps = {
  value: ClientActivityStatus;
  onChange: (status: ClientActivityStatus) => void;
  disabled?: boolean;
};

export function ActivityStatusSelect({
  value,
  onChange,
  disabled = false,
}: ActivityStatusSelectProps) {
  const options = useMemo(
    () =>
      CLIENT_ACTIVITY_STATUSES.map((status) => ({
        value: status,
        label: CLIENT_ACTIVITY_STATUS_LABELS[status],
      })),
    [],
  );

  return (
    <OptionDropdown
      value={value}
      onChange={(next) => onChange(next as ClientActivityStatus)}
      options={options}
      disabled={disabled}
      placeholder="Select status"
    />
  );
}
