import { NextResponse } from "next/server";
import { listStoredAppointments } from "@/lib/booking/store";

export async function GET() {
  const appointments = listStoredAppointments();
  return NextResponse.json({ appointments });
}
