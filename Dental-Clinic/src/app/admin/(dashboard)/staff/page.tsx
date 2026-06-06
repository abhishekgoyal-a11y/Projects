import { getAllDoctors } from "@/lib/data/doctors";

export default function AdminStaffPage() {
  const doctors = getAllDoctors();

  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Staff</h1>
      <p className="mt-2 text-neutral-600">Clinical team and schedules.</p>
      <div className="mt-8 grid gap-4">
        {doctors.map((d) => (
          <div key={d.slug} className="rounded-xl border border-neutral-300 bg-white p-6">
            <h2 className="font-semibold text-primary-900">{d.name}</h2>
            <p className="text-sm text-primary-500">{d.role}</p>
            <p className="mt-2 text-sm text-neutral-600">{d.credentials}</p>
            <p className="mt-3 text-xs text-neutral-500">
              Schedule: Mon–Fri 8am–6pm · Sat 9am–2pm (default)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
