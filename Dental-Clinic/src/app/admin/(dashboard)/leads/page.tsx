import { LeadsTable } from "@/components/admin/LeadsTable";

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Leads</h1>
      <p className="mt-2 text-neutral-600">Contact form and inquiry submissions.</p>
      <div className="mt-8">
        <LeadsTable />
      </div>
    </div>
  );
}
