import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { siteConfig, bookingUrlForService } from "@/lib/site";

export const metadata: Metadata = {
  title: `Dental Services in ${siteConfig.address.city}, ${siteConfig.address.state}`,
  description: `Comprehensive dental services in ${siteConfig.address.city} — cleanings, implants, Invisalign, veneers, emergency care & more. Book at ${siteConfig.name}.`,
};

export default function ServicesIndexPage() {
  return (
    <main id="main-content">
      <PageHero
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1600&h=700&fit=crop&q=80"
        eyebrow={`${siteConfig.address.city} · Full-Service Dentistry`}
        title="Treatments designed around your goals"
        lead="From preventive care to full smile transformations — every service is delivered with boutique attention on Pacific Avenue."
      >
        <Button href={siteConfig.bookingUrl} size="lg" className="mt-8">
          Book Appointment
        </Button>
      </PageHero>

      <section className="section-padding bg-neutral-100">
        <div className="mx-auto max-w-content">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <MotionReveal key={service.slug} delay={i * 0.03}>
                <article className="flex h-full flex-col rounded-xl border border-neutral-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-card">
                  <h2 className="font-display text-xl font-medium text-primary-900">
                    <Link href={`/services/${service.slug}`} className="hover:text-primary-700">
                      {service.hero.headline.replace(/ in San Francisco$/, "")}
                    </Link>
                  </h2>
                  {service.hero.priceFrom && (
                    <p className="mt-2 text-sm font-semibold text-accent-600">
                      From {service.hero.priceFrom}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-700 line-clamp-3">
                    {service.hero.subheadline}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-300 pt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Button href={bookingUrlForService(service.slug)} size="sm">
                      Book
                    </Button>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </ul>

          <div className="mt-12 rounded-xl bg-primary-900 p-8 text-center text-white md:p-10">
            <h2 className="font-display text-2xl">Not sure which treatment is right?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/80">
              Book a comprehensive exam and we&apos;ll create a personalized plan — no pressure,
              no surprises.
            </p>
            <Button href={siteConfig.bookingUrl} size="lg" className="mt-6">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
