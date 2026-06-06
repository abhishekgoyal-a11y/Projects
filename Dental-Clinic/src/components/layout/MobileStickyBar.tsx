import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-300 bg-white p-3 shadow-[0_-4px_20px_rgba(15,43,61,0.08)] lg:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-content items-center gap-2">
        <Button href={siteConfig.bookingUrl} size="md" className="flex-1">
          Book Appointment
        </Button>
        <a
          href={siteConfig.phoneHref}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 text-primary-700"
          aria-label={`Call ${siteConfig.phone}`}
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
