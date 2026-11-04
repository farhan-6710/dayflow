import { PillTabs } from "@/shared/components/PillTabs";
import { ACTIVE_STATUS_FILTERS, type ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type { ActiveStatusTabsProps } from "@/shared/types/components";

export function ActiveStatusTabs({ value, onChange, labels, counts }: ActiveStatusTabsProps) {
  return (
    <PillTabs
      label="Filter by status"
      value={value}
      onChange={(next) => onChange(next as ActiveStatusFilterId)}
      options={ACTIVE_STATUS_FILTERS.map((filter) => ({ value: filter, label: labels[filter], count: counts?.[filter] }))}
    />
  );
}
