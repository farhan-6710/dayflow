import { Link } from "react-router";

import { SITE_HOME_PATH } from "@/app/constants/siteRoutes";
import { BlurIn } from "@/features/site/components/motion/BlurIn";
import type { PageBannerProps } from "@/features/site/types/components";

/** Inner-page banner: breadcrumb, title and the coral rule, on the primary surface. */
export function PageBanner({ title, crumb }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-center text-primary-foreground">
      <div aria-hidden="true" className="absolute -top-24 -left-24 size-80 rounded-full bg-chart-1/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 -bottom-24 size-80 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="site-container relative">
        <BlurIn immediate y={30} duration={0.8}>
          <nav aria-label="Breadcrumb" className="mb-3 flex justify-center gap-2 text-[13px] tracking-[0.12em] text-primary-foreground/75 uppercase">
            <Link to={SITE_HOME_PATH} className="hover:text-primary-foreground">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{crumb ?? title}</span>
          </nav>
        </BlurIn>
        <BlurIn immediate y={30} duration={0.8} delay={0.1}>
          <h1 className="mb-3 font-heading text-[clamp(36px,5vw,60px)] leading-tight">{title}</h1>
          <span aria-hidden="true" className="mx-auto block h-[3px] w-14 rounded-full bg-chart-1" />
        </BlurIn>
      </div>
    </section>
  );
}
