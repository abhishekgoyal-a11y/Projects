import Image from "next/image";
import { Clock, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function ConciergeCard() {
  return (
    <aside className="rounded-xl border border-primary-300/40 bg-primary-100 p-5">
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
            alt="Sarah Mitchell, Patient Coordinator"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-500">Your coordinator</p>
          <p className="font-display text-lg text-primary-900">Sarah Mitchell</p>
          <p className="text-sm text-neutral-700">Patient Experience Team</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-primary-500" aria-hidden />
          Confirms within 1 business hour
        </li>
        <li className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-primary-500" aria-hidden />
          Prefer to talk?{" "}
          <a href={siteConfig.phoneHref} className="font-semibold text-primary-700 hover:underline">
            {siteConfig.phone}
          </a>
        </li>
      </ul>
    </aside>
  );
}
