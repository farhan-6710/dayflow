import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { ACTIVE_STATUS_FILTERS, type ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import type { ActiveStatusFilterProps } from "@/shared/types/components";

export function ActiveStatusFilter({ value, onChange, labels, disabled = false }: ActiveStatusFilterProps) {
  return (
    <OptionDropdown
      label="Filter by status"
      value={value}
      onChange={(next) => onChange(next as ActiveStatusFilterId)}
      options={ACTIVE_STATUS_FILTERS.map((filter) => ({ value: filter, label: labels[filter] }))}
      disabled={disabled}
      className="sm:w-44"
    />
  );
}
