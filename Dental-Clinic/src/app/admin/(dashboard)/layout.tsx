import Link from "next/link";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/seo", label: "SEO" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="hidden w-56 shrink-0 border-r border-neutral-300 bg-white p-6 lg:block">
        <Link href="/admin" className="font-display text-lg text-primary-900">
          Admin
        </Link>
        <p className="mt-1 text-xs text-neutral-500">{siteConfig.name}</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-primary-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-8 block text-sm text-primary-500 hover:underline">
          ← View site
        </Link>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
