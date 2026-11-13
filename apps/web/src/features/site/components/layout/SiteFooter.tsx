import { Link } from "react-router";

import { CLIENT_PORTAL_DASHBOARD_PATH } from "@/app/constants/clientPortalRoutes";
import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import { DESKTOP_RELEASES_URL, SITE_NAV_LINKS } from "@/features/site/constants/siteNav";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/shared/brand/brandManifest";
import { DayFlowLogo } from "@/shared/components/DayFlowLogo";
import { SUPPORT_URL } from "@/shared/constants/support";

const link = "text-sm text-muted-foreground transition-colors hover:text-foreground";

const PORTAL_LINKS = [
  { label: "Workspace", to: WORKSPACE_DASHBOARD_PATH },
  { label: "Client Portal", to: CLIENT_PORTAL_DASHBOARD_PATH },
];

function FooterTitle({ children }: { children: string }) {
  return <h3 className="m-0 font-heading text-base text-foreground">{children}</h3>;
}

/** Four columns on the deeper paper, then the copyright line. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <BlurIn className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5 self-start">
            <DayFlowLogo className="size-10" />
            <span className="font-heading text-xl text-foreground">{BRAND_NAME}</span>
          </Link>
          <p className="m-0 max-w-xs text-sm leading-relaxed text-muted-foreground">{BRAND_DESCRIPTION}</p>
        </BlurIn>
        <BlurIn delay={0.06}>
          <FooterTitle>Quick links</FooterTitle>
          <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
            {SITE_NAV_LINKS.map(({ label, to }) => (
              <li key={to}><Link className={link} to={to}>{label}</Link></li>
            ))}
          </ul>
        </BlurIn>
        <BlurIn delay={0.12}>
          <FooterTitle>Portals</FooterTitle>
          <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
            {PORTAL_LINKS.map(({ label, to }) => (
              <li key={to}><Link className={link} to={to}>{label}</Link></li>
            ))}
            <li><a className={link} href={DESKTOP_RELEASES_URL} target="_blank" rel="noopener noreferrer">Desktop app</a></li>
          </ul>
        </BlurIn>
        <BlurIn delay={0.18}>
          <FooterTitle>Get in touch</FooterTitle>
          <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0">
            <li><a className={link} href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">Help and support</a></li>
            <li><a className={link} href={`${SUPPORT_URL}/new`} target="_blank" rel="noopener noreferrer">Suggest a feature</a></li>
          </ul>
        </BlurIn>
      </div>
      <div className="border-t border-border">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <p className="m-0">{BRAND_TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
