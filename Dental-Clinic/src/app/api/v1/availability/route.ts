import { NextRequest, NextResponse } from "next/server";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { generateSlotsForDate, getAvailableDatesForMonth } from "@/lib/booking/slot-generator";
import { getBookedSlotsForRange } from "@/lib/booking/store";
import { getServiceDuration } from "@/lib/data/services";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const serviceSlug = searchParams.get("service") ?? "teeth-cleaning";
  const date = searchParams.get("date");
  const month = searchParams.get("month"); // YYYY-MM
  const duration = getServiceDuration(serviceSlug);
  const minNotice = Number(process.env.BOOKING_MIN_NOTICE_HOURS ?? 2);

  if (date) {
    const dayStart = parse(date, "yyyy-MM-dd", new Date());
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const booked = getBookedSlotsForRange(dayStart, dayEnd);
    const slots = generateSlotsForDate(date, duration, 10, booked, undefined, minNotice);
    return NextResponse.json({ date, serviceSlug, slots });
  }

  if (month) {
    const [year, mon] = month.split("-").map(Number);
    const from = startOfMonth(new Date(year, mon - 1));
    const to = endOfMonth(from);
    const booked = getBookedSlotsForRange(from, to);
    const bookedByDate: Record<string, { startsAt: Date; endsAt: Date }[]> = {};
    for (const b of booked) {
      const key = format(b.startsAt, "yyyy-MM-dd");
      if (!bookedByDate[key]) bookedByDate[key] = [];
      bookedByDate[key].push(b);
    }
    const dates = getAvailableDatesForMonth(year, mon, duration, bookedByDate);
    return NextResponse.json({ month, serviceSlug, dates });
  }

  return NextResponse.json({ error: "Provide date or month query param" }, { status: 400 });
}
