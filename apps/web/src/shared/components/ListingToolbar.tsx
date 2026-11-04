import type { ListingToolbarProps } from "@/shared/types/components";

/** Search on the left; status tabs and optional filter grouped on the right. */
export function ListingToolbar({ tabs, filter, search }: ListingToolbarProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 flex-1 basis-56">{search}</div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {tabs}
        {filter}
      </div>
    </div>
  );
}
