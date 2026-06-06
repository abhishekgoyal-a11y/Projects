import Link from "next/link";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";

const modules = [
  { href: "/admin/appointments", label: "Appointments", desc: "Review and confirm bookings" },
  { href: "/admin/leads", label: "Leads", desc: "Contact form submissions" },
  { href: "/admin/blog", label: "Blog", desc: "Manage articles" },
  { href: "/admin/reviews", label: "Reviews", desc: "Patient testimonials" },
  { href: "/admin/staff", label: "Staff", desc: "Doctors and schedules" },
  { href: "/admin/seo", label: "SEO", desc: "Meta and schema settings" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Dashboard</h1>
      <p className="mt-2 text-neutral-600">Welcome to Harborline Dental admin.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-xl border border-neutral-300 bg-white p-6 transition-shadow hover:shadow-card"
          >
            <h2 className="font-semibold text-primary-900">{m.label}</h2>
            <p className="mt-1 text-sm text-neutral-600">{m.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl text-primary-900">Recent appointments</h2>
        <div className="mt-4">
          <AppointmentsTable />
        </div>
      </section>
    </div>
  );
}
