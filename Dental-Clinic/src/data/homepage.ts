import {
  Sparkles,
  Shield,
  Clock,
  Heart,
  Microscope,
  Users,
  type LucideIcon,
} from "lucide-react";

export const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "12,000+", label: "Smiles Transformed" },
  { value: "4.9★", label: "Google Rating" },
  { value: "98%", label: "Patient Satisfaction" },
];

export const services = [
  {
    title: "Dental Exams & Cleanings",
    description:
      "Comprehensive preventive care with digital imaging and gentle hygiene — the foundation of lifelong oral health.",
    href: "/services/teeth-cleaning",
    popular: false,
  },
  {
    title: "Porcelain Veneers",
    description:
      "Hand-crafted veneers designed for natural luminosity. Transform chips, gaps, and discoloration in as few as two visits.",
    href: "/services/veneers",
    popular: true,
  },
  {
    title: "Dental Implants",
    description:
      "Permanent tooth replacement with 3D-guided placement. Restore confidence, function, and facial structure.",
    href: "/services/dental-implants",
    popular: false,
  },
  {
    title: "Invisalign® Clear Aligners",
    description:
      "Discreet orthodontic treatment with virtual previews of your future smile before you commit.",
    href: "/services/invisalign",
    popular: false,
  },
  {
    title: "Professional Whitening",
    description:
      "Clinical-grade whitening that lifts years of stains safely — results you can see after a single session.",
    href: "/services/teeth-whitening",
    popular: false,
  },
  {
    title: "Emergency Dentistry",
    description:
      "Same-day relief for toothaches, broken teeth, and dental trauma. Call us — we prioritize urgent cases.",
    href: "/services/emergency-dentistry",
    popular: false,
  },
];

export const whyChooseUs: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Sparkles,
    title: "Boutique Experience, Full-Service Care",
    description:
      "Every appointment feels unhurried. Our team treats one patient at a time — never a production line.",
  },
  {
    icon: Microscope,
    title: "Advanced Technology, Gentle Touch",
    description:
      "3D scanning, same-day crowns, and laser-assisted procedures mean fewer visits and more comfort.",
  },
  {
    icon: Shield,
    title: "Transparent Pricing, No Surprises",
    description:
      "You'll receive a clear treatment plan and cost estimate before any procedure begins. Always.",
  },
  {
    icon: Heart,
    title: "Anxiety-Free Environment",
    description:
      "Sedation options, noise-canceling headphones, and a judgment-free team for patients who've been away.",
  },
  {
    icon: Clock,
    title: "Evening & Saturday Appointments",
    description:
      "Premium care on your schedule — because your smile shouldn't wait for a day off.",
  },
  {
    icon: Users,
    title: "Continuity You Can Trust",
    description:
      "See the same clinicians at every visit. Your history, preferences, and goals are always remembered.",
  },
];

export const doctors = [
  {
    name: "Dr. Elena Vasquez, DDS",
    role: "Founder & Cosmetic Dentist",
    credentials: "USC Herman Ostrow · AACD Member",
    bio: "Specializing in smile design and minimally invasive aesthetics with 15 years of private practice experience.",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Dr. James Chen, DMD",
    role: "Implant & Restorative Specialist",
    credentials: "Harvard School of Dental Medicine",
    bio: "Board-certified in implantology with expertise in full-arch rehabilitation and complex restorative cases.",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f4a5b16d?w=400&h=500&fit=crop&q=80",
  },
  {
    name: "Dr. Sarah Okonkwo, DDS",
    role: "Family & Preventive Dentist",
    credentials: "UCSF School of Dentistry",
    bio: "Passionate about preventive care for families and creating positive first dental experiences for children.",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop&q=80",
  },
];

export const galleryCases = [
  {
    title: "10 Porcelain Veneers",
    category: "Cosmetic",
    before:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop&q=80",
    after:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
  },
  {
    title: "Full Smile Makeover",
    category: "Veneers + Whitening",
    before:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop&q=80",
    after:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=300&fit=crop&q=80",
  },
  {
    title: "Invisalign® Treatment",
    category: "Orthodontics",
    before:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    after:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
  },
];

export const testimonials = [
  {
    quote:
      "I'd avoided the dentist for six years. Dr. Vasquez made me feel completely at ease — no lectures, just exceptional care. My veneers look impossibly natural.",
    name: "Michael R.",
    treatment: "Porcelain Veneers",
    rating: 5,
  },
  {
    quote:
      "The implant process was explained at every step. Dr. Chen's precision gave me back the confidence to smile in photos again. Worth every penny.",
    name: "Jennifer L.",
    treatment: "Dental Implants",
    rating: 5,
  },
  {
    quote:
      "Our whole family comes here now. The kids actually look forward to cleanings. That says everything about this practice.",
    name: "David & Priya K.",
    treatment: "Family Dentistry",
    rating: 5,
  },
];

export const insuranceProviders = [
  "Delta Dental",
  "Cigna",
  "Aetna",
  "MetLife",
  "Guardian",
  "Blue Cross Blue Shield",
  "United Healthcare",
  "Humana",
];

export const faqs = [
  {
    question: "Do you accept new patients?",
    answer:
      "Yes — we welcome new patients and reserve dedicated appointment blocks each week. Book online or call us to schedule your first visit, which includes a comprehensive exam and personalized treatment discussion.",
  },
  {
    question: "How much does a first visit cost?",
    answer:
      "Our new patient comprehensive exam starts at $189 and includes digital X-rays, oral cancer screening, and a one-on-one consultation with your dentist. We'll provide a written estimate before any treatment.",
  },
  {
    question: "Do you offer financing for cosmetic treatments?",
    answer:
      "Absolutely. We partner with leading healthcare financing providers offering 0% APR plans for qualified patients, plus HSA and FSA acceptance on eligible procedures.",
  },
  {
    question: "What if I have dental anxiety?",
    answer:
      "You're not alone — many of our patients feel the same way. We offer nitrous oxide sedation, longer appointment times, and a calm, unhurried environment. Tell us your concerns when booking.",
  },
  {
    question: "How quickly can I be seen for a dental emergency?",
    answer:
      "We reserve same-day emergency slots every day. Call (415) 555-0142 and we'll prioritize your case. For after-hours trauma, our voicemail provides an on-call clinician number.",
  },
];
