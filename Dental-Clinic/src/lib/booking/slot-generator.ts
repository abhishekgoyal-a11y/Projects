import { addMinutes, format, parse, setHours, setMinutes, isBefore } from "date-fns";

export type ScheduleBlock = {
  dayOfWeek: number; // 0=Sunday
  startTime: string; // "08:00"
  endTime: string;
};

export type BookedSlot = {
  startsAt: Date;
  endsAt: Date;
};

export type TimeSlot = {
  start: string; // ISO
  end: string;
  available: boolean;
};

const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
  { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
  { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
  { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
  { dayOfWeek: 5, startTime: "08:00", endTime: "18:00" },
  { dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
];

function parseTimeOnDate(dateStr: string, time: string): Date {
  const base = parse(dateStr, "yyyy-MM-dd", new Date());
  const [h, m] = time.split(":").map(Number);
  return setMinutes(setHours(base, h), m);
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function generateSlotsForDate(
  dateStr: string,
  durationMinutes: number,
  bufferMinutes: number,
  booked: BookedSlot[],
  schedules: ScheduleBlock[] = DEFAULT_SCHEDULE,
  minNoticeHours = 2
): TimeSlot[] {
  const date = parse(dateStr, "yyyy-MM-dd", new Date());
  const dayOfWeek = date.getDay();
  const blocks = schedules.filter((s) => s.dayOfWeek === dayOfWeek);
  const slots: TimeSlot[] = [];
  const now = new Date();
  const minStart = addMinutes(now, minNoticeHours * 60);
  const slotDuration = durationMinutes + bufferMinutes;

  for (const block of blocks) {
    let cursor = parseTimeOnDate(dateStr, block.startTime);
    const blockEnd = parseTimeOnDate(dateStr, block.endTime);

    while (addMinutes(cursor, durationMinutes) <= blockEnd) {
      const slotEnd = addMinutes(cursor, durationMinutes);
      const taken = booked.some((b) => overlaps(cursor, slotEnd, b.startsAt, b.endsAt));
      const tooSoon = isBefore(cursor, minStart);
      const available = !taken && !tooSoon;

      slots.push({
        start: cursor.toISOString(),
        end: slotEnd.toISOString(),
        available,
      });

      cursor = addMinutes(cursor, slotDuration);
    }
  }

  return slots;
}

export function getAvailableDatesForMonth(
  year: number,
  month: number,
  durationMinutes: number,
  bookedByDate: Record<string, BookedSlot[]>
): { date: string; availableSlots: number }[] {
  const results: { date: string; availableSlots: number }[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = format(new Date(year, month - 1, day), "yyyy-MM-dd");
    const slots = generateSlotsForDate(dateStr, durationMinutes, 10, bookedByDate[dateStr] ?? []);
    const available = slots.filter((s) => s.available).length;
    if (available > 0 || slots.length > 0) {
      results.push({ date: dateStr, availableSlots: available });
    }
  }

  return results;
}
