import { NextRequest, NextResponse } from "next/server";
import { updateStoredLeadStatus } from "@/lib/booking/store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status;

  const valid = ["new", "contacted", "booked", "closed_won", "closed_lost"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateStoredLeadStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ lead: updated });
}
