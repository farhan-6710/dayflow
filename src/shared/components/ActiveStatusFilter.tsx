import { ACTIVE_STATUS_FILTERS, type ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { compactDropdownClassName } from "@/shared/constants/layoutStyles";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { cn } from "@/shared/lib/utils";

type ActiveStatusFilterProps = {
  value: ActiveStatusFilterId;
  onChange: (value: ActiveStatusFilterId) => void;
  labels: Record<ActiveStatusFilterId, string>;
  disabled?: boolean;
  placeholder?: string;
};

export function ActiveStatusFilter({
  value,
  onChange,
  labels,
  disabled = false,
  placeholder = "Filter by status",
}: ActiveStatusFilterProps) {
  const options = ACTIVE_STATUS_FILTERS.map((filter) => ({
    value: filter,
    label: labels[filter],
  }));

  return (
    <OptionDropdown
      value={value}
      onChange={(next) => onChange(next as ActiveStatusFilterId)}
      options={options}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(compactDropdownClassName, "sm:w-[220px]")}
    />
  );
}
