import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllServiceSlugs, getServiceBySlug } from "@/data/services";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const url = `${siteConfig.siteUrl}/services/${slug}`;

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    keywords: [
      `${slug.replace(/-/g, " ")} ${siteConfig.address.city}`,
      `dentist ${siteConfig.address.city}`,
      `${siteConfig.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: service.seoTitle,
      description: service.metaDescription,
      url,
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const pageUrl = `${siteConfig.siteUrl}/services/${slug}`;
  const serviceName = service.hero.headline.replace(` in ${siteConfig.address.city}`, "");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteConfig.siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Services",
                  item: `${siteConfig.siteUrl}/services`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: serviceName,
                  item: pageUrl,
                },
              ],
            },
            {
              "@type": "MedicalProcedure",
              name: serviceName,
              description: service.metaDescription,
              procedureType: service.hero.eyebrow,
              howPerformed: service.explanation.paragraphs[0],
              preparation: service.process.steps[0]?.description,
              followup: service.process.steps[service.process.steps.length - 1]?.description,
              provider: {
                "@type": "Dentist",
                name: siteConfig.name,
                telephone: siteConfig.phone,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: siteConfig.address.street,
                  addressLocality: siteConfig.address.city,
                  addressRegion: siteConfig.address.state,
                  postalCode: siteConfig.address.zip,
                  addressCountry: "US",
                },
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: service.faqs.map((faq) => ({
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
        <ServicePageTemplate service={service} />
      </main>
    </>
  );
}
