import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConciergeCard } from "@/components/booking/ConciergeCard";
import { getServiceBySlug } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Appointment Request Received",
};

type Props = { searchParams: Promise<{ code?: string; at?: string; service?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const { code, at, service: serviceSlug } = await searchParams;
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const appointmentTime = at ? new Date(at) : null;

  const checklist = [
    "Photo ID and insurance card (if applicable)",
    "List of current medications",
    "Arrive 10 minutes early to complete any new patient forms",
    "Free street parking on Pacific Avenue — validated garage parking available",
  ];

  return (
    <div className="mx-auto max-w-content px-5 py-12 md:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100 text-success-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <p className="eyebrow mt-6 text-primary-500">Request received</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-primary-900 md:text-4xl">
          We&apos;re preparing your visit
        </h1>
        {code && (
          <p className="mt-4 text-lg text-neutral-700">
            Reference: <strong className="font-mono text-primary-900">{code}</strong>
          </p>
        )}
        <p className="mt-3 text-neutral-600">
          Sarah from our patient experience team will confirm your appointment within one business
          hour. Watch for an email at the address you provided.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-300 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg text-primary-900">Appointment details</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            {service && (
              <li className="flex justify-between gap-4">
                <span className="text-neutral-500">Treatment</span>
                <span className="text-right font-semibold text-primary-900">
                  {service.hero.headline.replace(/ in San Francisco$/, "")}
                </span>
              </li>
            )}
            {appointmentTime && !Number.isNaN(appointmentTime.getTime()) && (
              <li className="flex justify-between gap-4">
                <span className="text-neutral-500">Requested time</span>
                <span className="text-right font-semibold text-primary-900">
                  {format(appointmentTime, "EEE, MMM d · h:mm a")}
                </span>
              </li>
            )}
            <li className="flex justify-between gap-4">
              <span className="text-neutral-500">Status</span>
              <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-600">
                Pending confirmation
              </span>
            </li>
          </ul>
        </div>

        <ConciergeCard />
      </div>

      <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-primary-900 p-6 text-white md:p-8">
        <h2 className="font-display text-xl">Before your visit</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/85">
          {checklist.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center">
        <Button href="/" variant="secondary">
          Return home
        </Button>
        <a
          href={siteConfig.phoneHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent-500 px-7 font-semibold text-white shadow-cta hover:bg-accent-600"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call {siteConfig.phone}
        </a>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-neutral-300 bg-neutral-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-neutral-700">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden />
            <div>
              <p className="font-semibold text-primary-900">{siteConfig.name}</p>
              <p>{siteConfig.address.full}</p>
              <p className="mt-1">{siteConfig.hours}</p>
            </div>
          </div>
          <Link
            href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.address.full)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline"
          >
            <Calendar className="h-4 w-4" aria-hidden />
            Get directions
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-neutral-500">
        Need to reschedule?{" "}
        <Link href="/contact" className="font-semibold text-primary-700 hover:underline">
          Contact our team
        </Link>
      </p>
    </div>
  );
}
