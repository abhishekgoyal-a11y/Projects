/**
 * In-memory appointment store for development / fallback when Supabase is not configured.
 * Replace with Supabase queries in production.
 */

import type { CreateAppointmentInput } from "@/lib/validations/booking";
import { generateConfirmationCode } from "@/lib/utils";

export type StoredAppointment = {
  id: string;
  confirmationCode: string;
  serviceSlug: string;
  doctorSlug?: string;
  startsAt: string;
  endsAt: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  type: "standard" | "emergency" | "follow_up";
  patient: CreateAppointmentInput["patient"];
  patientNotes?: string;
  createdAt: string;
};

export type StoredLead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  serviceInterest?: string;
  source: string;
  status: "new" | "contacted" | "booked" | "closed_won" | "closed_lost";
  createdAt: string;
};

const globalStore = globalThis as unknown as {
  appointments?: StoredAppointment[];
  leads?: StoredLead[];
};

function getAppointments(): StoredAppointment[] {
  if (!globalStore.appointments) globalStore.appointments = [];
  return globalStore.appointments;
}

function getLeads(): StoredLead[] {
  if (!globalStore.leads) globalStore.leads = [];
  return globalStore.leads;
}

export function createStoredAppointment(
  input: CreateAppointmentInput,
  durationMinutes: number
): StoredAppointment {
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000);
  const autoConfirm = process.env.BOOKING_AUTO_CONFIRM === "true";

  const appointment: StoredAppointment = {
    id: crypto.randomUUID(),
    confirmationCode: generateConfirmationCode(),
    serviceSlug: input.serviceSlug,
    doctorSlug: input.doctorSlug,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: autoConfirm ? "confirmed" : "pending",
    type: input.type,
    patient: input.patient,
    patientNotes: input.patient.notes,
    createdAt: new Date().toISOString(),
  };

  getAppointments().push(appointment);
  return appointment;
}

export function listStoredAppointments(): StoredAppointment[] {
  return [...getAppointments()].sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
  );
}

export function getStoredAppointment(id: string): StoredAppointment | undefined {
  return getAppointments().find((a) => a.id === id);
}

export function getStoredAppointmentByCode(code: string): StoredAppointment | undefined {
  return getAppointments().find((a) => a.confirmationCode === code);
}

export function updateStoredAppointmentStatus(
  id: string,
  status: StoredAppointment["status"]
): StoredAppointment | undefined {
  const appt = getAppointments().find((a) => a.id === id);
  if (appt) appt.status = status;
  return appt;
}

export function getBookedSlotsForRange(from: Date, to: Date): { startsAt: Date; endsAt: Date }[] {
  return getAppointments()
    .filter((a) => a.status !== "cancelled")
    .filter((a) => {
      const start = new Date(a.startsAt);
      return start >= from && start <= to;
    })
    .map((a) => ({ startsAt: new Date(a.startsAt), endsAt: new Date(a.endsAt) }));
}

export function createStoredLead(data: Omit<StoredLead, "id" | "status" | "createdAt">): StoredLead {
  const lead: StoredLead = {
    ...data,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  getLeads().push(lead);
  return lead;
}

export function listStoredLeads(): StoredLead[] {
  return [...getLeads()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateStoredLeadStatus(
  id: string,
  status: StoredLead["status"]
): StoredLead | undefined {
  const lead = getLeads().find((l) => l.id === id);
  if (lead) lead.status = status;
  return lead;
}
