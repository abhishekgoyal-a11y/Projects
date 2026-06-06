import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name} — how we collect, use, and protect your personal and health information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Your privacy matters. This policy explains how Harborline Dental Studio handles your personal information."
      updated="June 6, 2026"
      sections={[
        {
          title: "Information we collect",
          body: [
            "We collect information you provide when booking appointments, completing contact forms, or visiting our office — including name, email, phone number, insurance details, and health information relevant to your dental care.",
            "We may also collect technical data such as IP address and browser type when you use our website, solely to improve security and site performance.",
          ],
        },
        {
          title: "How we use your information",
          body: [
            "We use your information to schedule and deliver dental care, communicate about appointments, process insurance claims, and improve our services.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          title: "Health information (HIPAA)",
          body: [
            "Protected health information is handled in accordance with applicable HIPAA regulations. We maintain administrative, technical, and physical safeguards to protect your records.",
            "You may request access to or amendment of your health records by contacting our office.",
          ],
        },
        {
          title: "Contact",
          body: [
            `Questions about this policy? Email ${siteConfig.email} or call ${siteConfig.phone}.`,
          ],
        },
      ]}
    />
  );
}
