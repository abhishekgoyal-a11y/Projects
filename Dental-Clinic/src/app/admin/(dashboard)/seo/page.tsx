import { getAllServices } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

export default function AdminSeoPage() {
  const services = getAllServices();

  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">SEO</h1>
      <p className="mt-2 text-neutral-600">Page metadata overview.</p>

      <div className="mt-8 rounded-xl border border-neutral-300 bg-white p-6">
        <h2 className="font-semibold text-primary-900">Site defaults</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-neutral-500">Site URL</dt>
            <dd>{siteConfig.siteUrl}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Title template</dt>
            <dd>%s | {siteConfig.name}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mt-8 font-semibold text-primary-900">Service pages</h2>
      <ul className="mt-4 space-y-3">
        {services.map((s) => (
          <li key={s.slug} className="rounded-lg border border-neutral-300 p-4 text-sm">
            <p className="font-medium">{s.seoTitle}</p>
            <p className="mt-1 text-neutral-600">{s.metaDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
