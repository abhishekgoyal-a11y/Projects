"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ContactFormProps = {
  sourcePage?: string;
  serviceOptions?: { slug: string; title: string }[];
};

export function ContactForm({ sourcePage = "contact", serviceOptions = [] }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          phone: data.get("phone"),
          serviceInterest: data.get("serviceInterest") || undefined,
          message: data.get("message"),
          sourcePage,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-success-100 p-8 text-center" role="status">
        <p className="font-display text-xl text-success-600">Message sent!</p>
        <p className="mt-2 text-sm text-neutral-700">
          We&apos;ll respond within one business hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-xs font-bold uppercase">
            First name *
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-xs font-bold uppercase">
            Last name *
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase">
          Phone *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
        />
      </div>
      {serviceOptions.length > 0 && (
        <div>
          <label htmlFor="serviceInterest" className="mb-2 block text-xs font-bold uppercase">
            Service interest
          </label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
            defaultValue=""
          >
            <option value="">Select...</option>
            {serviceOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          minLength={10}
          className="w-full rounded-md border border-neutral-300 px-4 py-3"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-error-600">Something went wrong. Please try again.</p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
