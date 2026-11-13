import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";


export type FloatingIconName =
  | "calendar"
  | "clock"
  | "folder"
  | "notebook"
  | "bell"
  | "users"
  | "list"
  | "messages"
  | "chart"
  | "sparkles";

export type FloatingIconItem = {
  icon: FloatingIconName;
  className: string;
  rotate: number;
  delay?: number;
};

export type BlurInProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  duration?: number;
  y?: number;
  /** Reveal on mount rather than when scrolled into view (above-the-fold content). */
  immediate?: boolean;
};

export type BlurInItemProps = HTMLAttributes<HTMLLIElement> & { delay?: number };

export type PageSectionProps = {
  id?: string;
  /** `card` is the lighter paper, `paper` the page background: sections alternate between them. */
  tone: "card" | "paper";
  icons: FloatingIconItem[];
  /** Skip drawing it until it nears the screen. Not for sections with sticky or scroll-driven parts. */
  defer?: boolean;
  className?: string;
  children: ReactNode;
};

export type SectionIntroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  count?: number;
  center?: boolean;
  className?: string;
};

export type SiteLinkButtonProps = {
  to: string;
  variant?: "default" | "outline";
  size?: "lg" | "xl";
  className?: string;
  children: ReactNode;
};

export type SiteScreenId = "dashboard" | "clients" | "projects" | "calendar" | "reminders";

/** One workspace page captured for the site, in both themes. */
export type SiteScreen = { id: SiteScreenId; label: string; alt: string; light: string; dark: string };

export type FeatureChapterItem = {
  slug: string;
  title: string;
  /** Which workspace capture (see `siteScreens.ts`) illustrates this chapter. */
  screen: SiteScreenId;
  summary: string;
  benefits: string[];
};

export type FeatureChapterProps = {
  feature: FeatureChapterItem;
  index: number;
};

export type SpotlightStat = { value: string; label: string };

export type ProcessStep = { num: string; icon: LucideIcon; title: string; text: string };

export type FaqItem = { q: string; a: string };

export type FaqPickerProps = { items: FaqItem[] };

export type UseCase = { role: string; focus: string; text: string };

export type UseCaseCardProps = { item: UseCase; index: number; focused: boolean };

export type PageBannerProps = { title: string; crumb?: string };

export type MenuToggleProps = { open: boolean; onToggle: () => void };

export type HeaderNavLinksProps = { mobile?: boolean; onNavigate?: () => void };

export type WorkspaceButtonProps = { className?: string; onClick?: () => void };

export type ContactCard = {
  icon: LucideIcon;
  title: string;
  text: string;
  label: string;
  href: string;
  external?: boolean;
};
