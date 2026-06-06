import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Button } from "@/components/ui/Button";
import { getAllServices } from "@/lib/data/services";
import { insuranceProviders } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing & Insurance",
  description: `Transparent dental pricing at ${siteConfig.name}. Insurance accepted, financing available for cosmetic treatments.`,
};

export default function PricingPage() {
  const services = getAllServices();

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Transparent Pricing"
        title="Know your investment before treatment begins"
        lead="Every patient receives a written estimate. No surprise bills, no pressure — just honest guidance."
      />

      <section className="section-padding">
        <div className="mx-auto max-w-content">
          <div className="grid gap-4">
            {services.map((s, i) => (
              <MotionReveal key={s.slug} delay={i * 0.03}>
                <div className="flex flex-col justify-between gap-4 rounded-xl bg-white p-6 shadow-card sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-lg text-primary-900">
                      <Link href={`/services/${s.slug}`} className="hover:text-primary-700">
                        {s.hero.headline.replace(/ in San Francisco$/, "")}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">{s.metaDescription.slice(0, 120)}…</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-neutral-500">Starting at</p>
                    <p className="font-display text-2xl text-primary-900">{s.hero.priceFrom}</p>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-content text-center">
          <h2 className="section-title">Insurance & financing</h2>
          <p className="section-lead mx-auto">
            We accept most major PPO plans and offer 0% APR financing for qualified patients on
            cosmetic and elective procedures.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {insuranceProviders.map((p) => (
              <span
                key={p}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
              >
                {p}
              </span>
            ))}
          </div>
          <Button href="/book" className="mt-10">
            Get a Personalized Estimate
          </Button>
        </div>
      </section>
    </main>
  );
}
