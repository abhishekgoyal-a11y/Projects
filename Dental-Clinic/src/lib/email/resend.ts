import { Resend } from "resend";
import { siteConfig } from "@/lib/site";
import type { StoredAppointment } from "@/lib/booking/store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.RESEND_FROM_EMAIL ?? siteConfig.email;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? siteConfig.email;

export async function sendBookingConfirmation(appointment: StoredAppointment, serviceName: string) {
  if (!resend) return { ok: false, skipped: true };

  const date = new Date(appointment.startsAt).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const statusNote =
    appointment.status === "pending"
      ? "Your request is pending confirmation. Our team will contact you within one business hour."
      : "Your appointment is confirmed.";

  await resend.emails.send({
    from,
    to: appointment.patient.email,
    subject: `${siteConfig.name} — Appointment ${appointment.status === "pending" ? "Request" : "Confirmation"} ${appointment.confirmationCode}`,
    html: `
      <h1>Thank you, ${appointment.patient.firstName}</h1>
      <p>${statusNote}</p>
      <p><strong>Confirmation:</strong> ${appointment.confirmationCode}</p>
      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>When:</strong> ${date}</p>
      <p>Questions? Call ${siteConfig.phone}</p>
    `,
  });

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New booking: ${appointment.confirmationCode}`,
    html: `
      <p>New ${appointment.status} appointment</p>
      <p>${appointment.patient.firstName} ${appointment.patient.lastName} — ${appointment.patient.phone}</p>
      <p>${serviceName} on ${date}</p>
      <p>Code: ${appointment.confirmationCode}</p>
    `,
  });

  return { ok: true };
}

export async function sendContactNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}) {
  if (!resend) return { ok: false, skipped: true };

  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `New contact: ${data.firstName} ${data.lastName}`,
    html: `
      <p><strong>${data.firstName} ${data.lastName}</strong></p>
      <p>${data.email} · ${data.phone}</p>
      <p>${data.message}</p>
    `,
  });

  return { ok: true };
}
