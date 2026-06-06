import { testimonials } from "@/data/homepage";

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Reviews</h1>
      <p className="mt-2 text-neutral-600">
        Featured testimonials — Google Reviews sync available in Phase 4.
      </p>
      <ul className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <li key={t.name} className="rounded-xl border border-neutral-300 bg-white p-6">
            <p className="text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-primary-900">
              {t.name} — {t.treatment}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
