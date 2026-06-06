import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${siteConfig.name} — pricing, insurance, new patients, and emergency care in San Francisco.`,
};

export default function FAQPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Questions"
        title="Everything you want to know before your visit"
        lead="Can't find your answer? Call us or send a message — we're happy to help."
      />

      <section className="section-padding">
        <div className="mx-auto max-w-prose">
          <ServiceFAQ faqs={faqs} />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Contact Us</Button>
            <Button href="/book" variant="secondary">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
