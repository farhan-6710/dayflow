import { PageBanner } from "@/features/site/components/layout/PageBanner";
import { ContactSection } from "@/features/site/components/home/ContactSection";
import { CtaSection } from "@/features/site/components/home/CtaSection";
import { FaqSection } from "@/features/site/components/home/FaqSection";
import { useSiteTitle } from "@/features/site/hooks/useSiteTitle";

export function ContactPage() {
  useSiteTitle("Contact");
  return (
    <>
      <PageBanner title="Contact" />
      <ContactSection />
      <FaqSection />
      <CtaSection tone="paper" />
    </>
  );
}
