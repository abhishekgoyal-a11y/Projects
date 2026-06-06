import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/booking";
import { createStoredLead } from "@/lib/booking/store";
import { sendContactNotification } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const lead = createStoredLead({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      serviceInterest: parsed.data.serviceInterest,
      source: parsed.data.sourcePage ?? "contact",
    });

    await sendContactNotification(parsed.data);

    return NextResponse.json({ id: lead.id, status: "received" });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
