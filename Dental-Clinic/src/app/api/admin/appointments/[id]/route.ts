import { NextRequest, NextResponse } from "next/server";
import { getStoredAppointment, updateStoredAppointmentStatus } from "@/lib/booking/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status as "pending" | "confirmed" | "cancelled" | "completed";

  if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateStoredAppointmentStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ appointment: updated });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = getStoredAppointment(id);
  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}
