import type { Metadata } from "next";
import { Star } from "lucide-react";
import { GoogleReviewsSection } from "@/components/marketing/GoogleReviewsSection";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patient Reviews",
  description: `Read ${siteConfig.reviewCount}+ patient reviews. ${siteConfig.googleRating}★ rated dentist in San Francisco.`,
};

export default function ReviewsPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Patient Stories"
        title={`${siteConfig.googleRating}★ from ${siteConfig.reviewCount}+ reviews`}
        lead="We're honored by the trust our patients place in us. Here's what San Francisco families say about their Harborline experience."
      />

      <GoogleReviewsSection />

      <section className="section-padding bg-neutral-100">
        <div className="mx-auto mb-10 max-w-content text-center">
          <h2 className="section-title">Featured patient stories</h2>
        </div>
        <div className="mx-auto grid max-w-content gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <MotionReveal key={t.name} delay={i * 0.05}>
              <blockquote className="flex h-full flex-col rounded-xl bg-white p-6 shadow-card">
                <div className="flex gap-1 text-accent-500" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-neutral-300 pt-4">
                  <p className="font-semibold text-primary-900">{t.name}</p>
                  <p className="text-sm text-neutral-500">{t.treatment}</p>
                </footer>
              </blockquote>
            </MotionReveal>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-content text-center">
          <Button href="/book">Join Our Happy Patients</Button>
        </div>
      </section>
    </main>
  );
}
