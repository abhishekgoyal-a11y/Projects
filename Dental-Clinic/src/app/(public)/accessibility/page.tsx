import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: `Accessibility commitment for ${siteConfig.name} — our efforts to provide an inclusive experience for all patients.`,
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      description="We are committed to ensuring our website and office are accessible to all patients."
      updated="June 6, 2026"
      sections={[
        {
          title: "Our commitment",
          body: [
            "Harborline Dental Studio aims to conform to WCAG 2.1 Level AA guidelines. We continuously improve the accessibility of our website and physical office.",
          ],
        },
        {
          title: "Website features",
          body: [
            "Our site includes keyboard navigation support, visible focus indicators, semantic headings, alt text on images, and sufficient color contrast on primary content.",
            "We support reduced-motion preferences in animations and respect system accessibility settings.",
          ],
        },
        {
          title: "Office accessibility",
          body: [
            "Our Pacific Avenue location offers wheelchair-accessible entrances and treatment areas. Please contact us before your visit if you need any specific accommodations.",
          ],
        },
        {
          title: "Feedback",
          body: [
            `If you encounter accessibility barriers on our website or in our office, please contact us at ${siteConfig.email} or ${siteConfig.phone}. We take all feedback seriously and will work to resolve issues promptly.`,
          ],
        },
      ]}
    />
  );
}
