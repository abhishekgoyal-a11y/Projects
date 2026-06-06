import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/data/homepage";
import { siteConfig } from "@/lib/site";

const GOOGLE_PLACE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLACE_URL ??
  "https://www.google.com/maps/search/?api=1&query=Harborline+Dental+Studio+San+Francisco";

export function GoogleReviewsSection({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={compact ? "" : "section-padding bg-neutral-50"}
      aria-labelledby={compact ? undefined : "google-reviews-heading"}
    >
      <div className={compact ? "" : "mx-auto max-w-content"}>
        {!compact && (
          <div className="mb-8 text-center">
            <p className="eyebrow">Verified Reviews</p>
            <h2 id="google-reviews-heading" className="section-title mt-3">
              What patients say on Google
            </h2>
            <p className="section-lead mx-auto mt-4">
              Read verified reviews from real patients — or leave your own after your visit.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-neutral-300 bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-col items-center gap-4 border-b border-neutral-300 pb-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-neutral-300">
                <span className="font-display text-2xl font-bold text-primary-900">G</span>
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent-500" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-lg font-semibold text-primary-900">
                  {siteConfig.googleRating} out of 5
                </p>
                <p className="text-sm text-neutral-600">{siteConfig.reviewCount}+ Google reviews</p>
              </div>
            </div>
            <Button href={GOOGLE_PLACE_URL} variant="secondary" size="sm">
              Read on Google
            </Button>
          </div>

          <ul className={`mt-6 grid gap-4 ${compact ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
            {testimonials.map((t) => (
              <li key={t.name} className="rounded-lg bg-neutral-50 p-4">
                <div className="flex gap-0.5 text-accent-500" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  &ldquo;{t.quote.slice(0, 120)}…&rdquo;
                </p>
                <p className="mt-3 text-xs font-semibold text-primary-900">{t.name}</p>
                <p className="text-xs text-neutral-500">Google review · {t.treatment}</p>
              </li>
            ))}
          </ul>

          {!compact && (
            <p className="mt-6 text-center text-sm text-neutral-600">
              <Link href="/reviews" className="font-semibold text-primary-700 hover:underline">
                Read all patient stories →
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
