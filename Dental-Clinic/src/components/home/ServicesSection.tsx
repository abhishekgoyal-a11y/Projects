import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-neutral-100" aria-labelledby="services-heading">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="services-heading"
            eyebrow="Our Services"
            title="Comprehensive care for every smile"
            lead="From preventive cleanings to full smile transformations — every treatment is delivered with the precision and calm of a boutique studio."
          />
          <Button href="/services" variant="secondary" className="shrink-0 self-start lg:self-auto">
            View All Services
          </Button>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.title}>
              <article className="group flex h-full flex-col rounded-lg border border-neutral-300 bg-neutral-50 p-6 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-card">
                {service.popular && (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-600">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-medium text-primary-900">
                  <Link href={service.href} className="hover:text-primary-700">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-700 line-clamp-3">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
