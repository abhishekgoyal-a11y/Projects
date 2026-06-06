"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, startOfMonth } from "date-fns";
import { Check, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { ConciergeCard } from "@/components/booking/ConciergeCard";
import { getServiceOptions } from "@/lib/data/services";
import { getAllDoctors } from "@/lib/data/doctors";
import { cn } from "@/lib/utils";

type TimeSlot = { start: string; end: string; available: boolean };
type MonthDate = { date: string; availableSlots: number };

const STEPS = ["Choose service", "Pick a time", "Your details", "Confirm"];

const inputClass =
  "w-full min-h-12 rounded-lg border border-neutral-300 bg-white px-4 text-base transition-colors focus:border-primary-500 focus:outline-none focus:ring-[3px] focus:ring-primary-500/30";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const services = getServiceOptions();
  const doctors = getAllDoctors();

  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(searchParams.get("service") ?? "");
  const [doctorSlug, setDoctorSlug] = useState("");
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [monthDates, setMonthDates] = useState<MonthDate[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [notes, setNotes] = useState("");

  const monthKey = format(month, "yyyy-MM");
  const selectedService = services.find((s) => s.slug === serviceSlug);
  const selectedDoctor = doctors.find((d) => d.slug === doctorSlug);

  const fetchMonth = useCallback(async () => {
    if (!serviceSlug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/availability?service=${serviceSlug}&month=${monthKey}`);
      const data = await res.json();
      setMonthDates(data.dates ?? []);
    } finally {
      setLoading(false);
    }
  }, [serviceSlug, monthKey]);

  const fetchSlots = useCallback(async () => {
    if (!serviceSlug || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/availability?service=${serviceSlug}&date=${selectedDate}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } finally {
      setLoading(false);
    }
  }, [serviceSlug, selectedDate]);

  useEffect(() => {
    if (step >= 1 && serviceSlug) fetchMonth();
  }, [step, fetchMonth, serviceSlug]);

  useEffect(() => {
    if (selectedDate) fetchSlots();
  }, [selectedDate, fetchSlots]);

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          doctorSlug: doctorSlug || undefined,
          startsAt: selectedSlot,
          type: serviceSlug === "emergency-dentistry" ? "emergency" : "standard",
          patient: {
            firstName,
            lastName,
            email,
            phone,
            isNewPatient,
            notes: notes || undefined,
            smsOptIn: true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Booking failed");
        return;
      }
      const params = new URLSearchParams({ code: data.confirmationCode });
      if (selectedSlot) params.set("at", selectedSlot);
      if (serviceSlug) params.set("service", serviceSlug);
      router.push(`/book/confirmation?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function canProceed(): boolean {
    if (step === 0) return Boolean(serviceSlug);
    if (step === 1) return Boolean(selectedSlot);
    if (step === 2) return Boolean(firstName && lastName && email && phone.length >= 10);
    return true;
  }

  return (
    <div className="mx-auto max-w-content px-5 py-10 md:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <p className="eyebrow">Online scheduling</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-primary-900 md:text-4xl">
            Book your visit
          </h1>
          <p className="mt-3 max-w-xl text-neutral-700">
            Select your treatment, choose a time that works, and our patient coordinator will
            personally confirm your appointment.
          </p>

          <ol className="mt-8 flex flex-wrap gap-2" aria-label="Booking progress">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold",
                  i < step && "bg-success-100 text-success-600",
                  i === step && "bg-primary-900 text-white",
                  i > step && "bg-neutral-200 text-neutral-600"
                )}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? <Check className="h-3.5 w-3.5" aria-hidden /> : <span>{i + 1}</span>}
                {label}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-neutral-300/80 bg-white p-6 shadow-card md:p-8">
            {step === 0 && (
              <div className="space-y-6">
                <p className="text-sm font-semibold text-primary-900">What brings you in?</p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => {
                    const selected = serviceSlug === s.slug;
                    return (
                      <li key={s.slug}>
                        <button
                          type="button"
                          onClick={() => setServiceSlug(s.slug)}
                          className={cn(
                            "flex h-full w-full flex-col rounded-xl border p-4 text-left transition-all",
                            selected
                              ? "border-primary-900 bg-primary-100 ring-2 ring-primary-900/20"
                              : "border-neutral-300 hover:border-primary-500 hover:shadow-sm"
                          )}
                        >
                          <span className="font-display text-base font-medium text-primary-900">
                            {s.title}
                          </span>
                          {s.priceFrom && (
                            <span className="mt-1 text-sm font-semibold text-accent-600">
                              From {s.priceFrom}
                            </span>
                          )}
                          <span className="mt-2 flex items-center gap-1 text-xs text-neutral-600">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {s.durationMinutes} min
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div>
                  <label htmlFor="doctor-pref" className="mb-2 block text-sm font-semibold text-primary-900">
                    Clinician preference <span className="font-normal text-neutral-500">(optional)</span>
                  </label>
                  <select
                    id="doctor-pref"
                    value={doctorSlug}
                    onChange={(e) => setDoctorSlug(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Best available clinician</option>
                    {doctors.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name} — {d.role}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-neutral-500">
                    We&apos;ll match you with the right specialist for your treatment.
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                {selectedService && (
                  <div className="rounded-lg bg-primary-100 px-4 py-3 text-sm">
                    <span className="font-semibold text-primary-900">{selectedService.title}</span>
                    {selectedService.priceFrom && (
                      <span className="text-neutral-600"> · From {selectedService.priceFrom}</span>
                    )}
                  </div>
                )}

                <BookingCalendar
                  month={month}
                  onMonthChange={setMonth}
                  monthDates={monthDates}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot("");
                  }}
                  loading={loading}
                />

                {selectedDate && (
                  <div>
                    <p className="mb-3 text-sm font-semibold text-primary-900">Available times</p>
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                    ) : slots.filter((s) => s.available).length === 0 ? (
                      <p className="text-sm text-neutral-600">No times left this day — try another date.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {slots
                          .filter((s) => s.available)
                          .map((s) => (
                            <button
                              key={s.start}
                              type="button"
                              onClick={() => setSelectedSlot(s.start)}
                              aria-label={format(new Date(s.start), "h:mm a")}
                              aria-pressed={selectedSlot === s.start}
                              className={cn(
                                "min-h-11 rounded-lg border text-sm font-medium transition-colors",
                                selectedSlot === s.start
                                  ? "border-primary-900 bg-primary-900 text-white"
                                  : "border-neutral-300 hover:border-primary-500"
                              )}
                            >
                              {format(new Date(s.start), "h:mm a")}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Almost done — tell us how to reach you with your confirmation.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-1 block text-sm font-semibold">
                      First name *
                    </label>
                    <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-1 block text-sm font-semibold">
                      Last name *
                    </label>
                    <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                    Email *
                  </label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
                    Phone *
                  </label>
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
                </div>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1" checked={isNewPatient} onChange={(e) => setIsNewPatient(e.target.checked)} />
                  <span>This is my first visit to Harborline Dental Studio</span>
                </label>
                <div>
                  <label htmlFor="notes" className="mb-1 block text-sm font-semibold">
                    Anything we should know? <span className="font-normal text-neutral-500">(optional)</span>
                  </label>
                  <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} placeholder="Dental anxiety, insurance questions, symptoms..." />
                </div>
                <p className="text-xs text-neutral-500">
                  By continuing, you agree to our{" "}
                  <a href="/privacy" className="text-primary-700 underline">Privacy Policy</a>.
                </p>
              </div>
            )}

            {step === 3 && selectedService && (
              <div className="space-y-5">
                <div className="rounded-xl bg-neutral-50 p-5">
                  <h2 className="font-display text-xl text-primary-900">Appointment summary</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-neutral-300 pb-3">
                      <dt className="text-neutral-600">Service</dt>
                      <dd className="text-right font-semibold text-primary-900">{selectedService.title}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-neutral-300 pb-3">
                      <dt className="text-neutral-600">Date & time</dt>
                      <dd className="text-right font-semibold text-primary-900">
                        {format(new Date(selectedSlot), "EEE, MMM d · h:mm a")}
                      </dd>
                    </div>
                    {selectedDoctor && (
                      <div className="flex justify-between gap-4 border-b border-neutral-300 pb-3">
                        <dt className="text-neutral-600">Preference</dt>
                        <dd className="text-right font-semibold text-primary-900">{selectedDoctor.name}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-600">Patient</dt>
                      <dd className="text-right font-semibold text-primary-900">
                        {firstName} {lastName}
                      </dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-neutral-600">
                  Sarah from our team will confirm within one business hour. You&apos;ll receive an
                  email once your appointment is approved.
                </p>
              </div>
            )}

            {error && (
              <p className="mt-4 text-sm text-error-600" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" className="flex-1" disabled={!canProceed()} onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              ) : (
                <Button type="button" className="flex-1" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? "Submitting..." : "Request Appointment"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <ConciergeCard />
          {selectedService && (
            <div className="rounded-xl border border-neutral-300 bg-white p-5 text-sm shadow-sm">
              <p className="font-semibold text-primary-900">Selected treatment</p>
              <p className="mt-1 text-neutral-700">{selectedService.title}</p>
              {selectedService.priceFrom && (
                <p className="mt-2 font-semibold text-accent-600">From {selectedService.priceFrom}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
