import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { galleryCases } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Smile Gallery",
  description: `Before and after smile transformations at ${siteConfig.name}. Veneers, Invisalign, and full smile makeovers in San Francisco.`,
};

export default function SmileGalleryPage() {
  return (
    <main id="main-content">
      <PageHero
        variant="image"
        imageSrc="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&h=700&fit=crop&q=80"
        eyebrow="Real Results"
        title="Smile transformations we're proud of"
        lead="Drag to compare before and after. Every case shown with patient consent — your consultation includes a personalized preview of what's possible."
      />

      <section className="section-padding">
        <div className="mx-auto grid max-w-content gap-12">
          {galleryCases.map((item, i) => (
            <MotionReveal key={item.title} delay={i * 0.05}>
              <article className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <BeforeAfterSlider
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={`Before ${item.title}`}
                  afterAlt={`After ${item.title}`}
                />
                <div>
                  <p className="eyebrow">{item.category}</p>
                  <h2 className="mt-2 font-display text-2xl text-primary-900 md:text-3xl">{item.title}</h2>
                  <p className="mt-4 text-neutral-700 leading-relaxed">
                    This patient came to Harborline seeking a natural, confidence-boosting result.
                    Treatment was planned collaboratively with digital smile design preview before
                    any work began.
                  </p>
                  <Button href="/book?service=veneers" className="mt-6">
                    Start Your Transformation
                  </Button>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-content text-center text-xs text-neutral-500">
          Replace illustrative imagery with your practice&apos;s consented case photography before
          public launch.
        </p>
      </section>
    </main>
  );
}
