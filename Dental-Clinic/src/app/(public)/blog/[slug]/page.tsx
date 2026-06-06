import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog";
import { Button } from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <main id="main-content">
      <article>
        <header className="section-padding bg-primary-900 text-white">
          <div className="mx-auto max-w-prose">
            <Link href="/blog" className="text-sm text-accent-400 hover:underline">
              ← Back to blog
            </Link>
            <p className="mt-4 text-xs font-bold uppercase text-accent-400">{post.category}</p>
            <h1 className="mt-3 font-display text-3xl font-medium md:text-4xl">{post.title}</h1>
            <p className="mt-4 text-white/70">
              {post.publishedAt} · {post.readTime} read
            </p>
          </div>
        </header>

        <div className="relative mx-auto aspect-[21/9] max-w-content">
          <Image src={post.image} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>

        <div className="section-padding">
          <div className="prose prose-neutral mx-auto max-w-prose">
            {post.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-8 font-display text-2xl text-primary-900">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.includes("[")) {
                const html = block.replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a href="$2" class="text-primary-700 underline">$1</a>'
                );
                return (
                  <p
                    key={i}
                    className="mt-4 text-neutral-700"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
              return (
                <p key={i} className="mt-4 text-neutral-700">
                  {block}
                </p>
              );
            })}
          </div>
          <div className="mx-auto mt-12 max-w-prose text-center">
            <Button href="/book">Book a Consultation</Button>
          </div>
        </div>
      </article>
    </main>
  );
}
