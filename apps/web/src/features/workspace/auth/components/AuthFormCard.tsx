import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormCard({
  title,
  description,
  children,
  footer,
}: AuthFormCardProps) {
  return (
    <div className="w-full">
      <header className="mb-8 space-y-2">
        <h1 className="animate-hero text-3xl">{title}</h1>
        <p className="animate-hero text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="animate-hero space-y-6">{children}</div>
      {footer ? <div className="animate-hero mt-8">{footer}</div> : null}
    </div>
  );
}
