import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | Premium Dentist in San Francisco`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Award-level cosmetic & restorative dentistry in San Francisco. Porcelain veneers, dental implants, Invisalign & emergency care. Book online — same-day appointments available.",
  keywords: [
    "dentist San Francisco",
    "cosmetic dentist SF",
    "dental implants San Francisco",
    "porcelain veneers SF",
    "emergency dentist San Francisco",
    "Invisalign San Francisco",
  ],
  openGraph: {
    title: `${siteConfig.name} | Premium Dentist in San Francisco`,
    description:
      "Look forward to your next dental visit. Boutique care, transparent pricing, 4.9★ rated.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="pb-20 lg:pb-0">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
