import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your dental appointment at Harborline Dental Studio in San Francisco. Choose your service, pick a time, and confirm online.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading booking...</div>}>
      <BookingWizard />
    </Suspense>
  );
}
