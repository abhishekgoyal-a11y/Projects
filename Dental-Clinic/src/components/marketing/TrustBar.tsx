import { Award, Shield, Star, Users } from "lucide-react";
import { siteConfig } from "@/lib/site";

const badges = [
  { icon: Star, label: `${siteConfig.googleRating}★ Google`, sub: `${siteConfig.reviewCount}+ reviews` },
  { icon: Award, label: "AACD Member", sub: "Cosmetic excellence" },
  { icon: Shield, label: "ADA Compliant", sub: "Clinical standards" },
  { icon: Users, label: "15+ Years", sub: "Serving San Francisco" },
];

export function TrustBar() {
  return (
    <section
      className="border-b border-neutral-300/60 bg-white"
      aria-label="Credentials and trust indicators"
    >
      <div className="mx-auto max-w-content px-5 py-5 md:px-8 lg:px-10">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {badges.map((badge) => (
            <li key={badge.label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <badge.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-primary-900">{badge.label}</p>
                <p className="text-xs text-neutral-600">{badge.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
