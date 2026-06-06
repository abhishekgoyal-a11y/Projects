import { Calendar, Phone } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ConciergeCard } from "@/components/booking/ConciergeCard";
import { siteConfig } from "@/lib/site";

export function AppointmentFormSection() {
  return (
    <section id="appointment" className="section-padding bg-primary-900" aria-labelledby="appointment-heading">
      <div className="mx-auto max-w-content">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <SectionHeader
              id="appointment-heading"
              eyebrow="Book Your Visit"
              title="Your healthiest smile starts with one conversation"
              lead="Schedule online in under 60 seconds. Our patient coordinator will personally confirm your appointment — no call center, no hold music."
            />
            <ul className="mt-8 space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <span className="font-bold text-accent-400">01</span>
                <span>New patient exams include digital X-rays and a personalized treatment plan.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-400">02</span>
                <span>Cosmetic consultations are complimentary for veneer and smile makeover inquiries.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-400">03</span>
                <span>No pressure, no upsells — just honest guidance from clinicians you can trust.</span>
              </li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/book" size="lg">
                <Calendar className="h-5 w-5" aria-hidden />
                Book Online Now
              </Button>
              <Button href={siteConfig.phoneHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10">
                <Phone className="h-5 w-5" aria-hidden />
                {siteConfig.phone}
              </Button>
            </div>
          </div>

          <ConciergeCard />
        </div>
      </div>
    </section>
  );
}
