import Link from "next/link";
import { galleryCases } from "@/data/homepage";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function GallerySection() {
  return (
    <section id="gallery" className="section-padding bg-neutral-100" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-content">
        <SectionHeader
          id="gallery-heading"
          eyebrow="Smile Gallery"
          title="Real patients. Remarkable transformations."
          lead="Drag the slider to compare results. Every case is from an actual Harborline patient, shown with written consent. Individual outcomes vary."
        />

        <ul className="mt-12 grid gap-10 lg:grid-cols-3">
          {galleryCases.map((item) => (
            <li key={item.title}>
              <article>
                <BeforeAfterSlider
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={`Before ${item.title}`}
                  afterAlt={`After ${item.title}`}
                />
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary-500">
                    {item.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-medium text-primary-900">
                    {item.title}
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-neutral-500">
          Illustrative cases for design preview — replace with your practice&apos;s consented
          photography before launch.{" "}
          <Link href="/smile-gallery" className="font-semibold text-primary-700 hover:underline">
            View full gallery
          </Link>
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/smile-gallery">Explore Transformations</Button>
          <Button href={siteConfig.bookingUrl} variant="secondary">
            Book a Cosmetic Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
