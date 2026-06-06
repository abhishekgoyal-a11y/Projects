import { PageHero } from "@/components/marketing/PageHero";

type LegalSection = { title: string; body: string[] };

type LegalPageProps = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ title, description, updated, sections }: LegalPageProps) {
  return (
    <main id="main-content">
      <PageHero eyebrow="Legal" title={title} lead={description} variant="light" />
      <article className="section-padding">
        <div className="mx-auto max-w-prose">
          <p className="text-sm text-neutral-500">Last updated: {updated}</p>
          {sections.map((section) => (
            <section key={section.title} className="mt-10">
              <h2 className="font-display text-2xl text-primary-900">{section.title}</h2>
              <div className="mt-4 space-y-4 text-neutral-700 leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
