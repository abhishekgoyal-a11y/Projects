import Image from "next/image";
import { doctors } from "@/data/homepage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function DoctorsSection() {
  return (
    <section id="doctors" className="section-padding bg-neutral-50" aria-labelledby="doctors-heading">
      <div className="mx-auto max-w-content">
        <SectionHeader
          id="doctors-heading"
          eyebrow="Meet the Clinicians"
          title="Expert hands. Genuine care."
          lead="Our board-certified team brings decades of combined experience in cosmetic, restorative, and family dentistry — united by one belief: every patient deserves to feel heard."
          align="center"
        />

        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {doctors.map((doctor) => (
            <li key={doctor.name}>
              <article className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={`${doctor.name}, ${doctor.role}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-medium text-primary-900">
                    {doctor.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-primary-500">{doctor.role}</p>
                  <p className="mt-1 text-xs text-neutral-500">{doctor.credentials}</p>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">{doctor.bio}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Button href="/doctors" variant="secondary">
            Meet the Full Team
          </Button>
          <Button href={siteConfig.bookingUrl} className="ml-0 mt-3 sm:ml-3 sm:mt-0">
            Book with a Specialist
          </Button>
        </div>
      </div>
    </section>
  );
}
