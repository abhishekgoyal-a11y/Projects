import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dental Health Blog",
  description: `Expert dental advice from ${siteConfig.name} — implants, cosmetic dentistry, emergencies, and oral health tips for San Francisco patients.`,
};

export default function BlogPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Insights"
        title="Dental health, explained clearly"
        lead="Practical guides from our clinical team — no jargon, no scare tactics, just honest information to help you make confident decisions."
      />

      <section className="section-padding">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <MotionReveal key={post.slug} delay={i * 0.05}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card">
                <div className="relative aspect-[16/9]">
                  <Image src={post.image} alt="" fill className="object-cover" sizes="33vw" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase text-primary-500">{post.category}</p>
                  <h2 className="mt-2 font-display text-xl text-primary-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary-700">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-neutral-700">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-neutral-500">
                    {post.publishedAt} · {post.readTime} read
                  </p>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
