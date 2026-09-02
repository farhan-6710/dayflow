import type { MouseEvent, ReactNode } from "react";
import { Link, type NavLinkProps } from "react-router";

import { usePageTransition } from "@/shared/providers/pageTransitionContext";
import { routePath } from "@/shared/utils/routePath";

type TransitionLinkProps = NavLinkProps & {
  children?: ReactNode;
};

export function TransitionLink({
  onClick,
  className,
  to,
  children,
}: TransitionLinkProps) {
  const { navigateWithTransition, activePath } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    navigateWithTransition(to);
  };

  const isActive = activePath === routePath(to);
  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false, isTransitioning: false })
      : className;

  return (
    <Link to={to} onClick={handleClick} className={resolvedClassName}>
      {children}
    </Link>
  );
}
