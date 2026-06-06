import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

const treatmentLinks = [
  { label: "Dental Implants", href: "/services/dental-implants" },
  { label: "Porcelain Veneers", href: "/services/veneers" },
  { label: "Invisalign®", href: "/services/invisalign" },
  { label: "Teeth Whitening", href: "/services/teeth-whitening" },
  { label: "Emergency Care", href: "/emergency" },
];

const patientLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Patient Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="section-padding mx-auto max-w-content">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-xl font-medium">
              Harborline<span className="text-primary-300"> Dental</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {siteConfig.tagline}. Where clinical precision meets the warmth of
              true hospitality.
            </p>
            <p className="mt-4 text-sm font-semibold text-accent-400">
              ★ {siteConfig.googleRating} Google · {siteConfig.reviewCount}+ reviews
            </p>
            <Button href={siteConfig.bookingUrl} size="sm" className="mt-6">
              Book Appointment
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
              Treatments
            </h3>
            <ul className="mt-4 space-y-3">
              {treatmentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition-colors hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
              Patients
            </h3>
            <ul className="mt-4 space-y-3">
              {patientLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition-colors hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
              Contact
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-white/90">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <address className="not-italic">{siteConfig.address.full}</address>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <a href={siteConfig.phoneHref} className="hover:text-accent-400">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-400">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
