import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Button } from "@/components/ui/Button";
import { stats, whyChooseUs } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — boutique dental care in San Francisco with transparent pricing and advanced technology.`,
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&h=700&fit=crop&q=80"
        eyebrow="Our Story"
        title="Dentistry that feels nothing like a dental office"
        lead="Founded in Pacific Heights, Harborline Dental Studio was built on a simple belief: exceptional clinical care and a warm, unhurried experience should go hand in hand."
      />

      <section className="section-padding">
        <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-2 lg:items-center">
          <MotionReveal>
            <p className="eyebrow">Since 2011</p>
            <h2 className="section-title">A practice designed around you</h2>
            <p className="section-lead">
              Dr. Elena Vasquez opened Harborline after years in high-volume practices where
              patients felt rushed. Today, our team of three specialists serves families
              across {siteConfig.neighborhoods.slice(0, 4).join(", ")}, and beyond — with
              same-day emergency care, evening hours, and financing that makes premium
              dentistry accessible.
            </p>
            <div className="mt-8 flex gap-4">
              <Button href="/book">Book a Visit</Button>
              <Button href="/doctors" variant="secondary">
                Meet Our Doctors
              </Button>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80"
                alt="Harborline Dental Studio reception"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-content">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <MotionReveal key={s.label}>
                <p className="font-display text-3xl font-medium text-primary-900">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-700">{s.label}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-content">
          <h2 className="section-title text-center">Why patients choose Harborline</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <MotionReveal key={item.title}>
                <item.icon className="h-8 w-8 text-accent-500" aria-hidden />
                <h3 className="mt-4 font-display text-xl text-primary-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{item.description}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
