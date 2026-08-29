import { useMemo } from "react";

import {
  CLIENT_ACTIVITY_PRIORITIES,
  CLIENT_ACTIVITY_PRIORITY_LABELS,
} from "@/features/admin/client-activities/constants/activityStatuses";
import type { ClientActivityPriority } from "@/features/admin/client-activities/types/types";
import { OptionDropdown } from "@/shared/components/OptionDropdown";

type ActivityPrioritySelectProps = {
  value: ClientActivityPriority;
  onChange: (priority: ClientActivityPriority) => void;
  disabled?: boolean;
};

export function ActivityPrioritySelect({
  value,
  onChange,
  disabled = false,
}: ActivityPrioritySelectProps) {
  const options = useMemo(
    () =>
      CLIENT_ACTIVITY_PRIORITIES.map((priority) => ({
        value: priority,
        label: CLIENT_ACTIVITY_PRIORITY_LABELS[priority],
      })),
    [],
  );

  return (
    <OptionDropdown
      value={value}
      onChange={(next) => onChange(next as ClientActivityPriority)}
      options={options}
      disabled={disabled}
      placeholder="Select priority"
    />
  );
}
