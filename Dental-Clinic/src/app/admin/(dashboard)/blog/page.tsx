import Link from "next/link";
import { blogPosts } from "@/data/blog";

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Blog</h1>
      <p className="mt-2 text-neutral-600">
        Static blog posts — connect Supabase to enable full CMS editing.
      </p>
      <ul className="mt-8 space-y-3">
        {blogPosts.map((p) => (
          <li key={p.slug} className="flex items-center justify-between rounded-xl border border-neutral-300 bg-white p-4">
            <div>
              <p className="font-medium text-primary-900">{p.title}</p>
              <p className="text-sm text-neutral-500">{p.publishedAt}</p>
            </div>
            <Link href={`/blog/${p.slug}`} className="text-sm text-primary-500 hover:underline">
              View →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
