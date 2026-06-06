import { NextResponse } from "next/server";
import { listStoredLeads } from "@/lib/booking/store";

export async function GET() {
  return NextResponse.json({ leads: listStoredLeads() });
}
