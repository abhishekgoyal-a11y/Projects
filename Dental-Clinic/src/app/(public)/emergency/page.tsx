import type { Metadata } from "next";
import { AlertTriangle, Phone } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Emergency Dentist San Francisco",
  description: `Same-day emergency dental care in San Francisco. Toothache, broken tooth, knocked-out tooth. Call ${siteConfig.phone} now.`,
};

export default function EmergencyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Urgent Care"
        title="Dental emergency? We're here today."
        lead="We reserve same-day emergency slots every day. Call now for priority scheduling — don't wait in pain."
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={siteConfig.phoneHref}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-error-600 px-8 font-semibold text-white"
          >
            <Phone className="h-5 w-5" />
            Call {siteConfig.phone}
          </a>
          <Button href="/book?service=emergency-dentistry" variant="dark">
            Book Emergency Online
          </Button>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="mx-auto max-w-content">
          <div className="mb-10 flex items-start gap-4 rounded-xl border border-error-600/30 bg-error-100 p-6">
            <AlertTriangle className="h-6 w-6 shrink-0 text-error-600" />
            <p className="text-sm text-neutral-700">
              For life-threatening emergencies (difficulty breathing, severe facial trauma with
              heavy bleeding), call 911 or go to the nearest emergency room first.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Knocked-out tooth",
                steps: [
                  "Handle by the crown, not the root",
                  "Rinse gently — do not scrub",
                  "Try to reinsert or keep in milk/saliva",
                  "Call us immediately",
                ],
              },
              {
                title: "Severe toothache",
                steps: [
                  "Rinse with warm salt water",
                  "Use a cold compress for swelling",
                  "Take ibuprofen as directed",
                  "Call for same-day appointment",
                ],
              },
              {
                title: "Broken tooth or crown",
                steps: [
                  "Save any fragments",
                  "Cover sharp edges with dental wax",
                  "Avoid chewing on that side",
                  "Call us — we often repair same-day",
                ],
              },
              {
                title: "Dental abscess",
                steps: [
                  "Do not attempt to pop swelling",
                  "Rinse with salt water",
                  "Seek care within 24 hours",
                  "Untreated infections can spread",
                ],
              },
            ].map((item) => (
              <article key={item.title} className="rounded-xl bg-white p-6 shadow-card">
                <h2 className="font-display text-xl text-primary-900">{item.title}</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-neutral-700">
                  {item.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
