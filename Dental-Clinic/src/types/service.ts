export type ServicePageData = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    priceFrom?: string;
  };
  explanation: {
    title: string;
    paragraphs: string[];
  };
  benefits: {
    title: string;
    items: { title: string; description: string }[];
  };
  process: {
    title: string;
    steps: { title: string; description: string }[];
  };
  localSeo: {
    title: string;
    paragraphs: string[];
  };
  faqs: { question: string; answer: string }[];
  cta: {
    headline: string;
    subheadline: string;
    primaryLabel: string;
  };
  relatedSlugs: string[];
};
