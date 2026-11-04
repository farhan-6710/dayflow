import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cn } from "@/lib/cn";

const VARIANTS = {
  display: "font-heading text-[30px] leading-[38px]",
  title: "font-heading text-2xl leading-8",
  heading: "font-heading text-lg leading-6",
  subheading: "font-sans text-base leading-6",
  body: "font-sans text-[15px] leading-[22px]",
  label: "font-sans text-sm leading-5",
  caption: "font-sans text-xs leading-4",
  prose: "font-serif text-[15px] leading-6",
  stat: "font-heading text-[28px] leading-9",
} as const;

const TONES = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  inverse: "text-primary-foreground",
  accent: "text-chart-1",
  success: "text-success-text",
  destructive: "text-destructive",
} as const;

export type TextProps = RNTextProps & {
  variant?: keyof typeof VARIANTS;
  tone?: keyof typeof TONES;
};

export function Text({ variant = "body", tone = "default", className, ...props }: TextProps) {
  return <RNText className={cn(VARIANTS[variant], TONES[tone], className)} {...props} />;
}
