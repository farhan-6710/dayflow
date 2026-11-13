import { ArrowUpRight, Download, LayoutDashboard, LifeBuoy, Users } from "lucide-react";
import { Link } from "react-router";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurInItem } from "@/features/site/components/motion/BlurIn";
import { PageSection } from "@/features/site/components/section/PageSection";
import { SectionIntro } from "@/features/site/components/section/SectionIntro";
import { FLOATING_ICONS } from "@/features/site/constants/floatingIcons";
import { DESKTOP_RELEASES_URL } from "@/features/site/constants/siteNav";
import type { ContactCard } from "@/features/site/types/components";
import { SUPPORT_URL } from "@/shared/constants/support";

const CARDS: ContactCard[] = [
  { icon: LifeBuoy, title: "Help and support", text: "Report a problem or ask a question, and follow it to a fix.", label: "Open an issue", href: SUPPORT_URL, external: true },
  { icon: Download, title: "Desktop app", text: "Download DayFlow for your desktop from the latest release.", label: "See releases", href: DESKTOP_RELEASES_URL, external: true },
  { icon: LayoutDashboard, title: "Your workspace", text: "Already have an account? Pick up right where you left off.", label: "Open Workspace", href: WORKSPACE_DASHBOARD_PATH },
  { icon: Users, title: "Client portal", text: "Invited by a freelancer? Sign in with the email they added.", label: "Open Client Portal", href: CLIENT_PORTAL_DASHBOARD_PATH },
];

function CardLink({ card }: { card: ContactCard }) {
  const className = "mt-4 inline-flex items-center gap-1.5 text-sm text-foreground underline-offset-4 hover:underline";
  const content = (
    <>
      {card.label}
      <ArrowUpRight className="size-4 text-chart-1" aria-hidden="true" />
    </>
  );
  return card.external ? (
    <a className={className} href={card.href} target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <Link className={className} to={card.href}>{content}</Link>
  );
}

/** Ways to reach DayFlow, in the working-process card style. */
export function ContactSection() {
  return (
    <PageSection tone="paper" icons={FLOATING_ICONS.contact}>
      <SectionIntro eyebrow="Get in touch" title="Questions, ideas or a bug to report?" accent="ideas" lead="DayFlow is built in the open. Pick the way that fits what you need." center />
      <ul className="mt-10 mb-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <BlurInItem
              key={card.title}
              delay={0.1 + index * 0.08}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-chart-1/50"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-chart-1/15 text-chart-1 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 mb-0 font-heading text-lg text-foreground">{card.title}</h3>
              <p className="mt-2 mb-0 flex-1 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
              <CardLink card={card} />
            </BlurInItem>
          );
        })}
      </ul>
    </PageSection>
  );
}
