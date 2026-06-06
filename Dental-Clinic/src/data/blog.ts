export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-much-do-dental-implants-cost-san-francisco",
    title: "How Much Do Dental Implants Cost in San Francisco?",
    excerpt:
      "A transparent breakdown of implant pricing factors, financing options, and what to expect at your consultation.",
    category: "Dental Implants",
    publishedAt: "2026-05-12",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=450&fit=crop&q=80",
    content: `
Dental implant costs in San Francisco typically range from $3,500 to $6,500 per implant, including the crown. Several factors influence your final investment: bone grafting needs, implant brand, sedation preferences, and whether you need a single tooth or full-arch restoration.

At Harborline Dental Studio, every implant consultation includes 3D CBCT imaging, a written treatment plan, and transparent pricing before you commit. We accept most PPO insurance plans and offer 0% financing for qualified patients.

## What affects implant cost?

- **Number of implants** — Single tooth vs. multiple vs. All-on-4
- **Bone health** — Grafting or sinus lifts add to complexity
- **Restoration type** — Crown, bridge, or hybrid denture
- **Sedation** — IV sedation for anxious patients

## Is it worth it?

Implants are the only tooth replacement that preserves jawbone density and functions like natural teeth. Most patients report they wish they had done it sooner.

Ready to explore your options? [Book a complimentary implant consultation](/book?service=dental-implants).
    `.trim(),
  },
  {
    slug: "invisalign-vs-braces-san-francisco",
    title: "Invisalign vs. Braces: Which Is Right for You?",
    excerpt:
      "Compare treatment timelines, aesthetics, and candidacy for clear aligners versus traditional braces in SF.",
    category: "Orthodontics",
    publishedAt: "2026-04-28",
    readTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=450&fit=crop&q=80",
    content: `
Choosing between Invisalign and braces depends on your case complexity, lifestyle, and aesthetic priorities. Both can deliver excellent results when planned by an experienced clinician.

## Invisalign advantages

- Nearly invisible during treatment
- Removable for eating and special occasions
- Fewer emergency visits (no broken brackets)
- Virtual treatment preview before you start

## When braces may be better

- Complex bite corrections
- Significant tooth rotation
- Patients who prefer not to manage aligner wear time

At Harborline, Dr. Vasquez offers both options with digital scanning — no messy impressions. [Schedule an orthodontic consult](/book?service=invisalign) to see a 3D preview of your future smile.
    `.trim(),
  },
  {
    slug: "what-to-do-dental-emergency-san-francisco",
    title: "What to Do in a Dental Emergency in San Francisco",
    excerpt:
      "Knocked-out tooth, severe pain, or broken restoration? Step-by-step guidance before you reach our office.",
    category: "Emergency Care",
    publishedAt: "2026-04-10",
    readTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=450&fit=crop&q=80",
    content: `
Dental emergencies are stressful. Knowing what to do in the first 30 minutes can save a tooth.

## Knocked-out tooth

1. Handle by the crown, not the root
2. Rinse gently — do not scrub
3. Try to reinsert, or keep in milk/saliva
4. Call us immediately: we reserve same-day emergency slots

## Severe toothache

Rinse with warm salt water, use a cold compress for swelling, and take ibuprofen as directed. Avoid placing aspirin directly on gums.

## Broken tooth or crown

Save any fragments, cover sharp edges with dental wax, and call (415) 555-0142. [Book an emergency visit](/book?service=emergency-dentistry) online.
    `.trim(),
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
