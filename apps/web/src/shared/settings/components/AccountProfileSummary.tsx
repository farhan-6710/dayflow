import { Mail, CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { Reveal } from "@/shared/components/Reveal";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import { cn } from "@/shared/lib/utils";

type AccountProfileSummaryProps = {
  roleLabel: string;
  memberSince: string | null;
};

export function AccountProfileSummary({ roleLabel, memberSince }: AccountProfileSummaryProps) {
  const { displayName, avatarUrl, initials, email } = useUserDisplay();
  const joined = memberSince ? format(new Date(memberSince), "MMM d, yyyy") : null;

  return (
    <Reveal as="section" className={cn(panelClassName, "p-5")}>
      <div className="flex items-center gap-3">
        <UserAvatar src={avatarUrl} initials={initials} alt="" className="size-14 text-base" />
        <div className="min-w-0">
          <h2 className="truncate text-xl">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{roleLabel}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 rounded-xl bg-muted/50 px-3 py-3 text-sm">
        <p className="flex min-w-0 items-center gap-2">
          <Mail className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{email || "No email on file"}</span>
        </p>
        {joined ? (
          <p className="flex min-w-0 items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span>Joined {joined}</span>
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
