import { Star } from "lucide-react";
import { testimonials } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-padding bg-primary-900 text-white" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-content">
        <SectionHeader
          id="testimonials-heading"
          eyebrow="Patient Reviews"
          title="Trusted by thousands of San Francisco smiles"
          lead="Don't take our word for it — hear from patients who chose Harborline for cosmetic, restorative, and family care."
          align="center"
        />

        <p className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm">
          <span className="flex" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent-500 text-accent-500" />
            ))}
          </span>
          <span>
            <strong className="text-white">{siteConfig.googleRating}/5</strong>
            <span className="text-white/70"> from {siteConfig.reviewCount}+ verified reviews</span>
          </span>
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name}>
              <blockquote className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden />
                  ))}
                </div>
                <p className="mt-4 flex-1 font-display text-lg leading-relaxed text-white/95">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  <cite className="not-italic">
                    <span className="block font-semibold text-white">{item.name}</span>
                    <span className="text-sm text-white/60">{item.treatment}</span>
                  </cite>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Button href="/reviews" variant="dark">
            Read All Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}
