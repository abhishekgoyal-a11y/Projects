import { services as staticServices } from "@/data/services";
import type { ServicePageData } from "@/types/service";

const DURATION_BY_SLUG: Record<string, number> = {
  "teeth-cleaning": 60,
  "root-canal-treatment": 90,
  "dental-implants": 90,
  braces: 60,
  invisalign: 45,
  "teeth-whitening": 60,
  veneers: 60,
  crowns: 75,
  bridges: 75,
  "pediatric-dentistry": 45,
  "emergency-dentistry": 30,
};

export function getAllServices(): ServicePageData[] {
  return staticServices;
}

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return staticServices.find((s) => s.slug === slug);
}

export function getServiceDuration(slug: string): number {
  return DURATION_BY_SLUG[slug] ?? 60;
}

export function getServiceOptions() {
  return staticServices.map((s) => ({
    slug: s.slug,
    title: s.hero.headline.replace(/^Professional | in San Francisco$/gi, "").trim() || s.slug,
    durationMinutes: getServiceDuration(s.slug),
    priceFrom: s.hero.priceFrom,
    description: s.hero.subheadline.slice(0, 100) + (s.hero.subheadline.length > 100 ? "…" : ""),
  }));
}
