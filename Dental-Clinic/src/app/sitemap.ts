import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { getAllServices } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/about",
    "/doctors",
    "/smile-gallery",
    "/reviews",
    "/faq",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
    "/emergency",
    "/blog",
    "/book",
    "/services",
  ];

  const servicePages = getAllServices().map((s) => `/services/${s.slug}`);
  const blogPages = blogPosts.map((p) => `/blog/${p.slug}`);

  const all = [...staticPages, ...servicePages, ...blogPages];

  return all.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/services") ? 0.9 : 0.7,
  }));
}
