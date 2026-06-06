import { doctors as staticDoctors } from "@/data/homepage";

export type Doctor = {
  slug: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  image: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/dr\.\s*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAllDoctors(): Doctor[] {
  return staticDoctors.map((d) => ({
    ...d,
    slug: slugify(d.name),
  }));
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return getAllDoctors().find((d) => d.slug === slug);
}
