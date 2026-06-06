"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type MonthDate = { date: string; availableSlots: number };

type BookingCalendarProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  monthDates: MonthDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  loading?: boolean;
};

export function BookingCalendar({
  month,
  onMonthChange,
  monthDates,
  selectedDate,
  onSelectDate,
  loading,
}: BookingCalendarProps) {
  const availability = new Map(monthDates.map((d) => [d.date, d.availableSlots]));
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = startOfDay(new Date());

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, -1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-lg text-primary-900">{format(month, "MMMM yyyy")}</p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-50"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {day}
          </div>
        ))}

        {loading && monthDates.length === 0 ? (
          <div className="col-span-7 flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        ) : (
          days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const inMonth = isSameMonth(day, month);
            const available = availability.get(dateStr) ?? 0;
            const isPast = isBefore(day, today);
            const disabled = !inMonth || isPast || available === 0;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(dateStr)}
                aria-label={`${format(day, "EEEE, MMMM d")}${available > 0 ? `, ${available} slots` : ", unavailable"}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative min-h-11 rounded-lg text-sm font-medium transition-colors",
                  !inMonth && "invisible",
                  inMonth && disabled && "cursor-not-allowed text-neutral-400",
                  inMonth && !disabled && !isSelected && "bg-primary-100 text-primary-900 hover:bg-primary-300",
                  isSelected && "bg-primary-900 text-white"
                )}
              >
                {format(day, "d")}
                {inMonth && available > 0 && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-500" />
                )}
              </button>
            );
          })
        )}
      </div>

      {selectedDate && (
        <p className="mt-3 text-center text-sm text-neutral-600">
          Selected: {format(new Date(selectedDate + "T12:00:00"), "EEEE, MMMM d")}
        </p>
      )}
    </div>
  );
}
