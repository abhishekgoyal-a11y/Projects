/**
 * Seed script — run after linking Supabase and applying migrations.
 * Usage: npx tsx scripts/seed.ts
 *
 * Currently documents static data sources; extend to insert into Supabase
 * when NEXT_PUBLIC_SUPABASE_URL is configured.
 */

import { services } from "../src/data/services";
import { doctors, faqs, testimonials } from "../src/data/homepage";
import { blogPosts } from "../src/data/blog";

console.log("Harborline Dental — seed data summary");
console.log(`Services: ${services.length}`);
console.log(`Doctors: ${doctors.length}`);
console.log(`FAQs: ${faqs.length}`);
console.log(`Testimonials: ${testimonials.length}`);
console.log(`Blog posts: ${blogPosts.length}`);
console.log("\nTo seed Supabase, configure env vars and extend this script with supabase-js inserts.");
