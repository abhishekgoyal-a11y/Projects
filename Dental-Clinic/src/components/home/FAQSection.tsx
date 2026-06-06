"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-neutral-100" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-content">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeader
              id="faq-heading"
              eyebrow="FAQ"
              title="Questions before your first visit?"
              lead="Everything you need to know about booking, pricing, and what to expect — answered clearly, without the jargon."
            />
            <Button href={siteConfig.bookingUrl} className="mt-8">
              Book Your Appointment
            </Button>
          </div>

          <div className="lg:col-span-3">
            <dl className="divide-y divide-neutral-300 rounded-xl border border-neutral-300 bg-neutral-50">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;

                return (
                  <div key={faq.question}>
                    <dt>
                      <button
                        id={buttonId}
                        type="button"
                        className="flex w-full min-h-14 items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-primary-900 transition-colors hover:bg-primary-100/50"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        {faq.question}
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-primary-500 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                    </dt>
                    <dd
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="px-6 pb-5 text-sm leading-relaxed text-neutral-700"
                    >
                      {faq.answer}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
