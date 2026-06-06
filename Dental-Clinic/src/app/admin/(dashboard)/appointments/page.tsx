import { AppointmentsTable } from "@/components/admin/AppointmentsTable";

export default function AdminAppointmentsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-primary-900">Appointments</h1>
      <p className="mt-2 text-neutral-600">Approve, confirm, or cancel patient bookings.</p>
      <div className="mt-8">
        <AppointmentsTable />
      </div>
    </div>
  );
}
