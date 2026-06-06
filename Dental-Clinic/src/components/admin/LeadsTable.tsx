"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { StoredLead } from "@/lib/booking/store";

export function LeadsTable() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: StoredLead["status"]) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  if (loading) return <p className="text-neutral-600">Loading leads...</p>;

  if (leads.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-600">
        No leads yet. Contact form submissions will appear here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-300 bg-neutral-50">
          <tr>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Contact</th>
            <th className="p-4 font-semibold">Message</th>
            <th className="p-4 font-semibold">Source</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b border-neutral-300 last:border-0">
              <td className="p-4 font-medium">
                {l.firstName} {l.lastName}
              </td>
              <td className="p-4">
                {l.email}
                <br />
                <span className="text-neutral-500">{l.phone}</span>
              </td>
              <td className="max-w-xs truncate p-4">{l.message}</td>
              <td className="p-4">{l.source}</td>
              <td className="p-4">
                <select
                  value={l.status}
                  onChange={(e) => updateStatus(l.id, e.target.value as StoredLead["status"])}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </td>
              <td className="p-4 text-neutral-500">
                {format(new Date(l.createdAt), "MMM d, yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
