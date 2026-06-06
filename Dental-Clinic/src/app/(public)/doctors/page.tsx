import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Button } from "@/components/ui/Button";
import { getAllDoctors } from "@/lib/data/doctors";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Doctors",
  description: `Meet the clinicians at ${siteConfig.name} — cosmetic, implant, and family dentistry specialists in San Francisco.`,
};

export default function DoctorsPage() {
  const doctors = getAllDoctors();

  return (
    <main id="main-content">
      <PageHero
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&h=700&fit=crop&q=80"
        eyebrow="Clinical Team"
        title="Clinicians you'll see at every visit"
        lead="Continuity matters. Our doctors collaborate on complex cases and share one philosophy: honest guidance, gentle technique, and results that look natural."
      />

      <section className="section-padding">
        <div className="mx-auto grid max-w-content gap-12">
          {doctors.map((doctor, i) => (
            <MotionReveal key={doctor.slug} delay={i * 0.05}>
              <article className="grid gap-8 rounded-xl bg-white p-6 shadow-card md:grid-cols-[240px_1fr] md:p-8">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-lg">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>
                <div>
                  <p className="eyebrow">{doctor.role}</p>
                  <h2 className="mt-2 font-display text-2xl text-primary-900">{doctor.name}</h2>
                  <p className="mt-1 text-sm font-medium text-primary-500">{doctor.credentials}</p>
                  <p className="mt-4 text-neutral-700">{doctor.bio}</p>
                  <Button href="/book" size="sm" className="mt-6">
                    Book with {doctor.name.split(",")[0]}
                  </Button>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
