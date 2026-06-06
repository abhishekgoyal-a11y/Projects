"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = { question: string; answer: string };

type ServiceFAQProps = {
  faqs: FAQ[];
};

export function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <dl className="divide-y divide-neutral-300 rounded-xl border border-neutral-300 bg-neutral-50">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `service-faq-${index}`;
        const buttonId = `service-faq-btn-${index}`;

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
  );
}
