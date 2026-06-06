import Link from "next/link";
import { Phone, Star, MapPin, ChevronRight, CheckCircle2 } from "lucide-react";
import type { ServicePageData } from "@/types/service";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { bookingUrlForService, siteConfig } from "@/lib/site";
import { getServiceBySlug } from "@/data/services";

type ServicePageTemplateProps = {
  service: ServicePageData;
};

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const bookUrl = bookingUrlForService(service.slug);
  const isEmergency = service.slug === "emergency-dentistry";

  return (
    <>
      {/* Breadcrumbs */}
      <nav
        className="border-b border-neutral-300 bg-neutral-50 px-5 py-3 md:px-8 lg:px-10"
        aria-label="Breadcrumb"
      >
        <ol className="mx-auto flex max-w-content flex-wrap items-center gap-1 text-sm text-neutral-500">
          <li>
            <Link href="/" className="hover:text-primary-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link href="/services" className="hover:text-primary-700">
              Services
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="font-medium text-primary-900" aria-current="page">
            {service.hero.headline.replace(` in ${siteConfig.address.city}`, "")}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section
        className={`section-padding ${isEmergency ? "bg-error-100" : "bg-primary-900"} text-white`}
        aria-labelledby="service-hero-heading"
      >
        <div className="mx-auto max-w-content">
          <p className={`eyebrow ${isEmergency ? "text-error-600" : "text-primary-300"}`}>
            {service.hero.eyebrow}
          </p>
          <h1
            id="service-hero-heading"
            className="mt-3 max-w-3xl font-display text-[32px] font-medium leading-tight md:text-5xl"
          >
            {service.hero.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {service.hero.subheadline}
          </p>

          {service.hero.priceFrom && (
            <p className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold">
              Starting from {service.hero.priceFrom}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isEmergency ? (
              <>
                <Button href={siteConfig.phoneHref} variant="emergency" size="lg">
                  <Phone className="h-5 w-5" aria-hidden />
                  Call {siteConfig.phone}
                </Button>
                <Button href={bookUrl} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10">
                  Book Emergency Slot
                </Button>
              </>
            ) : (
              <>
                <Button href={bookUrl} size="lg">
                  {service.cta.primaryLabel}
                </Button>
                <Button
                  href={siteConfig.phoneHref}
                  variant="secondary"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  {siteConfig.phone}
                </Button>
              </>
            )}
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden />
              {siteConfig.googleRating} · {siteConfig.reviewCount}+ reviews
            </span>
            <span className="hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden />
              {siteConfig.address.full}
            </span>
          </p>
        </div>
      </section>

      {/* Explanation */}
      <section className="section-padding bg-neutral-50" aria-labelledby="explanation-heading">
        <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeader id="explanation-heading" title={service.explanation.title} />
            <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
              {service.explanation.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="rounded-xl border border-neutral-300 bg-primary-100 p-6 lg:col-span-2 lg:self-start">
            <h3 className="font-display text-lg font-medium text-primary-900">
              Quick facts
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                Serving {siteConfig.address.city} &amp; surrounding neighborhoods
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                Most PPO insurance plans accepted
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                0% APR financing available
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                Evening &amp; Saturday appointments
              </li>
            </ul>
            <Button href={bookUrl} className="mt-6 w-full">
              {service.cta.primaryLabel}
            </Button>
          </aside>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-neutral-100" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-content">
          <SectionHeader
            id="benefits-heading"
            eyebrow="Benefits"
            title={service.benefits.title}
            align="center"
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.items.map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-neutral-300 bg-neutral-50 p-6 shadow-sm"
              >
                <h3 className="font-display text-lg font-medium text-primary-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-neutral-50" aria-labelledby="process-heading">
        <div className="mx-auto max-w-content">
          <SectionHeader
            id="process-heading"
            eyebrow="What to Expect"
            title={service.process.title}
          />
          <ol className="mt-12 space-y-0">
            {service.process.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex gap-6 border-l-2 border-primary-300 pb-10 pl-8 last:pb-0"
              >
                <span
                  className="absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-primary-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Local SEO */}
      <section className="section-padding bg-primary-100" aria-labelledby="local-heading">
        <div className="mx-auto max-w-content">
          <SectionHeader id="local-heading" title={service.localSeo.title} />
          <div className="mt-6 max-w-prose space-y-4 text-neutral-700 leading-relaxed">
            {service.localSeo.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-primary-700">
            Areas we serve:{" "}
            {siteConfig.neighborhoods.join(" · ")} · {siteConfig.address.city},{" "}
            {siteConfig.address.state}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-neutral-100" aria-labelledby="service-faq-heading">
        <div className="mx-auto max-w-content">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeader
                id="service-faq-heading"
                eyebrow="FAQ"
                title="Frequently asked questions"
                lead={`Common questions about ${service.hero.headline.replace(` in ${siteConfig.address.city}`, "").toLowerCase()} at our ${siteConfig.address.city} practice.`}
              />
            </div>
            <div className="lg:col-span-3">
              <ServiceFAQ faqs={service.faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      {service.relatedSlugs.length > 0 && (
        <section className="border-t border-neutral-300 bg-neutral-50 px-5 py-10 md:px-8 lg:px-10">
          <div className="mx-auto max-w-content">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Related treatments
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {service.relatedSlugs.map((slug) => {
                const related = getServiceBySlug(slug);
                if (!related) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="inline-flex rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:border-primary-500 hover:bg-primary-100"
                    >
                      {related.hero.headline.replace(` in ${siteConfig.address.city}`, "")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="section-padding bg-primary-900 text-white"
        aria-labelledby="service-cta-heading"
      >
        <div className="mx-auto max-w-content text-center">
          <h2 id="service-cta-heading" className="font-display text-3xl font-medium md:text-4xl">
            {service.cta.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            {service.cta.subheadline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isEmergency ? (
              <Button href={siteConfig.phoneHref} variant="emergency" size="lg">
                <Phone className="h-5 w-5" aria-hidden />
                {service.cta.primaryLabel}
              </Button>
            ) : (
              <Button href={bookUrl} size="lg">
                {service.cta.primaryLabel}
              </Button>
            )}
            <Button href={siteConfig.phoneHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10">
              <Phone className="h-5 w-5" aria-hidden />
              {siteConfig.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
