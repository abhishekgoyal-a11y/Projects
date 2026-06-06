import { NextRequest, NextResponse } from "next/server";
import { createAppointmentSchema } from "@/lib/validations/booking";
import { createStoredAppointment } from "@/lib/booking/store";
import { getServiceBySlug, getServiceDuration } from "@/lib/data/services";
import { sendBookingConfirmation } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const service = getServiceBySlug(parsed.data.serviceSlug);
    if (!service) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const duration = getServiceDuration(parsed.data.serviceSlug);
    const appointment = createStoredAppointment(parsed.data, duration);

    await sendBookingConfirmation(appointment, service.hero.headline);

    return NextResponse.json({
      id: appointment.id,
      confirmationCode: appointment.confirmationCode,
      status: appointment.status,
      startsAt: appointment.startsAt,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
