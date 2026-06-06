import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for using the ${siteConfig.name} website and online booking.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="By using our website and online scheduling, you agree to the following terms."
      updated="June 6, 2026"
      sections={[
        {
          title: "Website use",
          body: [
            "This website provides general information about our dental practice and allows you to request appointments. It does not constitute medical advice.",
            "Online booking requests are subject to confirmation by our team. A submitted request does not guarantee an appointment until confirmed.",
          ],
        },
        {
          title: "Accuracy of information",
          body: [
            "We strive to keep website content accurate and up to date. Pricing shown is indicative and may vary based on your individual treatment plan.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "Harborline Dental Studio is not liable for delays or failures caused by circumstances beyond our reasonable control, including technical issues with third-party services.",
          ],
        },
        {
          title: "Contact",
          body: [
            `For questions about these terms, contact ${siteConfig.email}.`,
          ],
        },
      ]}
    />
  );
}
