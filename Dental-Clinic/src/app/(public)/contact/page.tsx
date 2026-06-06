import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { getServiceOptions } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${siteConfig.name} in San Francisco. ${siteConfig.address.full}. Call ${siteConfig.phone} or send a message.`,
};

export default function ContactPage() {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const mapSrc = mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(siteConfig.address.full)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.address.full)}&output=embed`;

  return (
    <main id="main-content">
      <PageHero
        variant="light"
        eyebrow="Get in Touch"
        title="We'd love to hear from you"
        lead="Questions about treatment, insurance, or scheduling? Reach out — we respond within one business hour."
      />

      <section className="section-padding">
        <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6">
              <a href={siteConfig.phoneHref} className="flex items-start gap-4 text-primary-900">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-neutral-700">{siteConfig.phone}</p>
                </div>
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-4 text-primary-900">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-neutral-700">{siteConfig.email}</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-neutral-700">{siteConfig.address.full}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-accent-500" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-neutral-700">{siteConfig.hours}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl">
              <iframe
                title="Harborline Dental Studio location"
                src={mapSrc}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl text-primary-900">Send a message</h2>
            <div className="mt-6">
              <ContactForm sourcePage="contact" serviceOptions={getServiceOptions()} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
