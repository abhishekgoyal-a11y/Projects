import Image from "next/image";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  variant?: "dark" | "light" | "image";
  imageSrc?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  variant = "dark",
  imageSrc,
}: PageHeroProps) {
  if (variant === "image" && imageSrc) {
    return (
      <section className="relative overflow-hidden bg-primary-900 text-white" aria-labelledby="page-hero-title">
        <div className="absolute inset-0">
          <Image src={imageSrc} alt="" fill className="object-cover opacity-35" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/50" />
        </div>
        <div className="relative section-padding">
          <div className="mx-auto max-w-content">
            <MotionReveal>
              {eyebrow && <p className="eyebrow text-accent-400">{eyebrow}</p>}
              <h1 id="page-hero-title" className="mt-3 max-w-3xl font-display text-3xl font-medium md:text-5xl">
                {title}
              </h1>
              {lead && <p className="section-lead mt-4 max-w-2xl text-white/85">{lead}</p>}
              {children}
            </MotionReveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "section-padding",
        variant === "light" ? "border-b border-neutral-300 bg-neutral-50 text-primary-900" : "bg-primary-900 text-white"
      )}
      aria-labelledby="page-hero-title"
    >
      <div className="mx-auto max-w-content">
        <MotionReveal>
          {eyebrow && (
            <p className={cn("eyebrow", variant === "light" ? "text-primary-500" : "text-accent-400")}>{eyebrow}</p>
          )}
          <h1 id="page-hero-title" className="mt-3 font-display text-3xl font-medium md:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className={cn("section-lead", variant === "light" ? "text-neutral-700" : "text-white/80")}>{lead}</p>
          )}
          {children}
        </MotionReveal>
      </div>
    </section>
  );
}
