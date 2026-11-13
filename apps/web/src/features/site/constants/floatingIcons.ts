import type { FloatingIconItem, FloatingIconName } from "@/features/site/types/components";

const left = (icon: FloatingIconName, top: string, rotate: number): FloatingIconItem => ({
  icon,
  className: `left-[1.5%] ${top} w-16 xl:w-20`,
  rotate,
});

const right = (icon: FloatingIconName, bottom: string, rotate: number): FloatingIconItem => ({
  icon,
  className: `right-[1.5%] ${bottom} w-16 xl:w-20`,
  rotate,
  delay: 0.5,
});

/** Faint work icons that drift behind each section on desktop (eatrrite's floating food). */
export const FLOATING_ICONS = {
  spotlight: [left("calendar", "top-[28%]", 14), right("notebook", "bottom-[10%]", -18)],
  features: [left("folder", "top-[36%]", -18), right("clock", "bottom-[12%]", 12)],
  portals: [left("users", "top-[36%]", -18), right("messages", "bottom-[12%]", 12)],
  why: [left("list", "top-[30%]", -14), right("sparkles", "bottom-[14%]", 16)],
  process: [left("bell", "top-[34%]", -12), right("chart", "bottom-[16%]", 14)],
  faq: [left("notebook", "top-[40%]", -14), right("calendar", "bottom-[18%]", 18)],
  useCases: [left("clock", "top-[34%]", -12), right("folder", "bottom-[16%]", 14)],
  contact: [left("messages", "top-[30%]", 10), right("users", "bottom-[14%]", -12)],
  cta: [left("sparkles", "top-[28%]", 10), right("list", "bottom-[12%]", -12)],
} satisfies Record<string, FloatingIconItem[]>;
