import type { ResponsiveGreetingProps } from "@/shared/types/components";
import { getGreeting } from "@/shared/utils/greeting";

/** "Hi" up to 640px wide, where a longer greeting crowds the name; the time of day above that. */
export function ResponsiveGreeting({ name }: ResponsiveGreetingProps) {
  return (
    <>
      <span className="min-[641px]:hidden">Hi</span>
      <span className="hidden min-[641px]:inline">{getGreeting()}</span>, {name}
    </>
  );
}
