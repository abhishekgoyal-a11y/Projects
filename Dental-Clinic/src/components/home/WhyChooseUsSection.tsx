import { whyChooseUs } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function WhyChooseUsSection() {
  return (
    <section id="why-us" className="section-padding bg-primary-100" aria-labelledby="why-heading">
      <div className="mx-auto max-w-content">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader
              id="why-heading"
              eyebrow="Why Harborline"
              title="Dentistry redesigned around you"
              lead="We built this practice for patients who expect more — more time, more clarity, more comfort, and results that speak for themselves."
            />
            <Button href={siteConfig.bookingUrl} className="mt-8">
              Schedule Your Consultation
            </Button>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-primary-300/30 bg-neutral-50 p-6 shadow-sm"
              >
                <item.icon className="h-8 w-8 text-primary-500" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-medium text-primary-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
