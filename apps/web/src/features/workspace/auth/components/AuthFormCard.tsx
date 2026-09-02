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
      <div className="mb-5 space-y-1 lg:mb-6">
        <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-5">
        {children}
        {footer}
      </div>
    </div>
  );
}
