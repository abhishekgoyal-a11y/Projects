import { Phone, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function EmergencySection() {
  return (
    <section
      id="emergency"
      className="section-padding bg-error-100"
      aria-labelledby="emergency-heading"
    >
      <div className="mx-auto max-w-content">
        <div className="flex flex-col items-start gap-8 rounded-xl border border-error-600/20 bg-white p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-error-600">
              <AlertCircle className="h-5 w-5" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-wider">Emergency Dental Care</p>
            </div>
            <h2 id="emergency-heading" className="mt-3 font-display text-2xl font-medium text-primary-900 md:text-3xl">
              Toothache, broken tooth, or dental trauma?
            </h2>
            <p className="mt-3 text-neutral-700">
              We reserve same-day emergency appointments every day. Don&apos;t wait in pain —
              call now and our team will prioritize your case.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-700">
              <Clock className="h-4 w-4" aria-hidden />
              Same-day slots available · Mon–Sat
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[260px]">
            <Button href={siteConfig.phoneHref} variant="emergency" size="lg" className="w-full">
              <Phone className="h-5 w-5" aria-hidden />
              Call {siteConfig.phone}
            </Button>
            <Button href="/emergency" variant="secondary" size="md" className="w-full">
              Emergency Care Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
