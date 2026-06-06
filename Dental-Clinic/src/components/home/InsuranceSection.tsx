import { CreditCard, ShieldCheck } from "lucide-react";
import { insuranceProviders } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function InsuranceSection() {
  return (
    <section className="section-padding bg-neutral-50" aria-labelledby="insurance-heading">
      <div className="mx-auto max-w-content">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              id="insurance-heading"
              eyebrow="Insurance & Financing"
              title="Premium care that fits your budget"
              lead="We work with most major PPO plans and offer flexible financing so cost never stands between you and the smile you deserve."
            />

            <ul className="mt-8 space-y-4">
              <li className="flex gap-4">
                <ShieldCheck className="h-6 w-6 shrink-0 text-primary-500" aria-hidden />
                <div>
                  <p className="font-semibold text-primary-900">Insurance accepted</p>
                  <p className="text-sm text-neutral-700">
                    We&apos;ll verify your benefits before treatment and handle claims on your behalf.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <CreditCard className="h-6 w-6 shrink-0 text-primary-500" aria-hidden />
                <div>
                  <p className="font-semibold text-primary-900">0% APR financing available</p>
                  <p className="text-sm text-neutral-700">
                    Flexible monthly plans for qualified patients. HSA and FSA accepted.
                  </p>
                </div>
              </li>
            </ul>

            <Button href="/pricing" variant="secondary" className="mt-8">
              View Pricing & Financing
            </Button>
          </div>

          <div className="rounded-xl border border-neutral-300 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">
              Plans we accept
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {insuranceProviders.map((provider) => (
                <li
                  key={provider}
                  className="rounded-lg bg-neutral-100 px-4 py-3 text-center text-sm font-medium text-primary-900"
                >
                  {provider}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-neutral-500">
              Don&apos;t see your plan? Contact us — we&apos;ll help you understand your coverage
              and out-of-pocket options before your visit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
