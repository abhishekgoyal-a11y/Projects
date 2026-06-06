import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-300/50 bg-neutral-50 px-5 py-4">
        <div className="mx-auto flex max-w-content items-center justify-between">
          <Logo />
          <a href={siteConfig.phoneHref} className="text-sm font-semibold text-primary-700">
            {siteConfig.phone}
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
