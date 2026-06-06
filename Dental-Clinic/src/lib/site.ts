export const siteConfig = {
  name: "Harborline Dental Studio",
  tagline: "Premium Dentistry in San Francisco",
  siteUrl: "https://harborlinedental.com",
  phone: "(415) 555-0142",
  phoneHref: "tel:+14155550142",
  email: "hello@harborlinedental.com",
  address: {
    street: "2400 Pacific Avenue, Suite 200",
    city: "San Francisco",
    state: "CA",
    zip: "94115",
    full: "2400 Pacific Avenue, Suite 200, San Francisco, CA 94115",
  },
  hours: "Mon–Fri 8am–6pm · Sat 9am–2pm",
  bookingUrl: "/book",
  googleRating: 4.9,
  reviewCount: 312,
  neighborhoods: [
    "Pacific Heights",
    "Marina District",
    "Russian Hill",
    "Nob Hill",
    "Cow Hollow",
    "Presidio Heights",
    "Laurel Heights",
    "Fillmore District",
  ],
};

export function bookingUrlForService(slug: string) {
  return `/book?service=${slug}`;
}
