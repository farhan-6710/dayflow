import type { ErrorBannerProps } from "@/shared/types/components";

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div role="alert" className="rounded-[0.9rem] border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none">
      {message}
    </div>
  );
}
