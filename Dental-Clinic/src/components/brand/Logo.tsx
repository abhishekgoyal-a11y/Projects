import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
  href?: string;
};

export function Logo({ className, variant = "dark", href = "/" }: LogoProps) {
  const textPrimary = variant === "light" ? "text-white" : "text-primary-900";
  const textAccent = variant === "light" ? "text-accent-400" : "text-primary-500";

  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)}>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-900 shadow-card ring-2 ring-accent-500/40 transition-transform group-hover:scale-105"
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
          <path
            d="M8 14c0-4 3-7 8-7s8 3 8 7c0 5-4 11-8 13-4-2-8-8-8-13Z"
            className="fill-accent-500"
          />
          <path
            d="M12 13c1.5-2 4-2 5.5 0M18.5 13c1.5-2 4-2 5.5 0"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className={cn("font-display text-lg font-medium leading-none md:text-xl", textPrimary)}>
        Harborline
        <span className={cn("block text-sm font-normal md:text-base", textAccent)}>Dental Studio</span>
      </span>
    </Link>
  );
}
