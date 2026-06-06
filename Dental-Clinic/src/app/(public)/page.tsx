import {
  HeroSection,
  StatisticsSection,
  ServicesSection,
  WhyChooseUsSection,
  DoctorsSection,
  GallerySection,
  TestimonialsSection,
  InsuranceSection,
  EmergencySection,
  FAQSection,
  AppointmentFormSection,
} from "@/components/home";
import { TrustBar } from "@/components/marketing/TrustBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
import { faqs } from "@/data/homepage";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Dentist",
              "@id": `${siteConfig.siteUrl}/#dentist`,
              name: siteConfig.name,
              description:
                "Premium cosmetic and restorative dentistry in San Francisco.",
              url: siteConfig.siteUrl,
              telephone: siteConfig.phone,
              email: siteConfig.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: siteConfig.address.street,
                addressLocality: siteConfig.address.city,
                addressRegion: siteConfig.address.state,
                postalCode: siteConfig.address.zip,
                addressCountry: "US",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: siteConfig.googleRating,
                reviewCount: siteConfig.reviewCount,
              },
              priceRange: "$$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "14:00",
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ],
        }}
      />

      <main id="main-content">
        <HeroSection />
        <TrustBar />
        <StatisticsSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <DoctorsSection />
        <GallerySection />
        <TestimonialsSection />
        <InsuranceSection />
        <EmergencySection />
        <FAQSection />
        <AppointmentFormSection />
      </main>
    </>
  );
}
