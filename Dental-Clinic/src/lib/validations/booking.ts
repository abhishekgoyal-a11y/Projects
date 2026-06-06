import { z } from "zod";

export const bookingPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required").max(20),
  isNewPatient: z.boolean().default(true),
  dateOfBirth: z.string().optional(),
  insuranceProvider: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
  smsOptIn: z.boolean().default(true),
});

export const createAppointmentSchema = z.object({
  serviceSlug: z.string().min(1),
  doctorSlug: z.string().optional(),
  startsAt: z.string().datetime({ offset: true }),
  type: z.enum(["standard", "emergency", "follow_up"]).default("standard"),
  patient: bookingPatientSchema,
});

export const contactFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  serviceInterest: z.string().optional(),
  message: z.string().min(10).max(2000),
  sourcePage: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
