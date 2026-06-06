import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
