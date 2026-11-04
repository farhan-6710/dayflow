import { useId } from "react";
import { Search } from "lucide-react";

import { useShellNavSearch } from "@/shared/hooks/useShellNavSearch";
import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type { ShellNavSearchProps } from "@/shared/types/components";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/shared/ui/popover";

export function ShellNavSearch({ nav, placeholder }: ShellNavSearchProps) {
  const search = useShellNavSearch(nav);
  const listId = useId();
  const activeId = `${listId}-${search.activeIndex}`;

  return (
    <Popover open={search.open}>
      <PopoverAnchor asChild>
        <div className="relative min-w-0 flex-1 md:w-40 md:flex-none lg:w-52 xl:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            role="combobox"
            value={search.query}
            placeholder={placeholder}
            aria-label={placeholder}
            aria-expanded={search.open}
            aria-controls={listId}
            aria-activedescendant={search.open && search.results.length > 0 ? activeId : undefined}
            className="h-10 bg-card pl-9"
            onChange={(event) => search.onQueryChange(event.target.value)}
            onFocus={() => search.setFocused(true)}
            onBlur={() => search.setFocused(false)}
            onKeyDown={search.onKeyDown}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        className="w-(--radix-popover-trigger-width) min-w-56 p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        {search.results.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">No matching pages.</p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Pages">
            {search.results.map((item, index) => {
              const Icon = shellNavIcons[item.icon];
              return (
                <li
                  key={item.to}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === search.activeIndex}
                  // Keeps focus in the input, so blur doesn't close the list before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => search.go(item)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm",
                    index === search.activeIndex && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
