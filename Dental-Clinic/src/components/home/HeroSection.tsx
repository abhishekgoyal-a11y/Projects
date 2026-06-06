import Image from "next/image";
import { Phone, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-primary-900"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&h=900&fit=crop&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-900/80 to-primary-700/70" />
      </div>

      <div className="relative mx-auto grid max-w-content gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-32">
        <div>
          <p className="eyebrow text-primary-300">Premium Dentistry · San Francisco</p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-[36px] font-medium leading-[1.12] text-white md:text-5xl lg:text-[56px]"
          >
            Look forward to your next dental visit
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/90">
            Whether it&apos;s been six months or six years, Harborline Dental Studio
            delivers award-level cosmetic and restorative care — with zero judgment
            and complete transparency.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={siteConfig.bookingUrl} size="lg">
              <Calendar className="h-5 w-5" aria-hidden />
              Book Your Appointment
            </Button>
            <Button href={siteConfig.phoneHref} variant="secondary" size="lg" className="border-white/40 text-white hover:bg-white/10">
              <Phone className="h-5 w-5" aria-hidden />
              {siteConfig.phone}
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-accent-500 text-accent-500" aria-hidden />
              <span>
                <strong className="font-semibold text-white">{siteConfig.googleRating}</strong>{" "}
                · {siteConfig.reviewCount}+ Google reviews
              </span>
            </li>
            <li className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden />
            <li>Same-day emergency slots</li>
            <li className="hidden h-4 w-px bg-white/30 md:block" aria-hidden />
            <li>Evening & Saturday hours</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=700&h=875&fit=crop&q=80"
              alt="Patient smiling after cosmetic dental treatment at Harborline Dental Studio"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 0px"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-5 shadow-card">
            <p className="text-3xl font-display font-medium text-primary-900">98%</p>
            <p className="text-sm text-neutral-700">Patient satisfaction rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
