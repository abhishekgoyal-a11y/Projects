"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { StoredAppointment } from "@/lib/booking/store";

export function AppointmentsTable() {
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/appointments")
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: StoredAppointment["status"]) {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  if (loading) return <p className="text-neutral-600">Loading appointments...</p>;

  if (appointments.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">
        No appointments yet. Bookings from /book will appear here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-300 bg-neutral-50">
          <tr>
            <th className="p-4 font-semibold">Code</th>
            <th className="p-4 font-semibold">Patient</th>
            <th className="p-4 font-semibold">Service</th>
            <th className="p-4 font-semibold">When</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-b border-neutral-300 last:border-0">
              <td className="p-4 font-mono text-xs">{a.confirmationCode}</td>
              <td className="p-4">
                {a.patient.firstName} {a.patient.lastName}
                <br />
                <span className="text-neutral-500">{a.patient.phone}</span>
              </td>
              <td className="p-4">{a.serviceSlug}</td>
              <td className="p-4">{format(new Date(a.startsAt), "MMM d, h:mm a")}</td>
              <td className="p-4">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    a.status === "confirmed"
                      ? "bg-success-100 text-success-600"
                      : a.status === "pending"
                        ? "bg-accent-100 text-accent-600"
                        : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="p-4">
                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(a.id, "confirmed")}
                      className="text-xs font-semibold text-success-600 hover:underline"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(a.id, "cancelled")}
                      className="text-xs font-semibold text-error-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
