"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/smile-gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-primary-900"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-neutral-300/50 bg-neutral-50/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-content items-center justify-between gap-4 px-5 md:px-8 lg:px-10">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-700 transition-colors hover:text-primary-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {siteConfig.phone}
            </a>
            <Button href={siteConfig.bookingUrl} size="sm">
              Book Appointment
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={siteConfig.phoneHref}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700"
              aria-label={`Call ${siteConfig.phone}`}
            >
              <Phone className="h-5 w-5" />
            </a>
            <Button href={siteConfig.bookingUrl} size="sm" className="hidden sm:inline-flex">
              Book
            </Button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-primary-900"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="absolute inset-0 bg-primary-900/60"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-primary-900 p-6 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-4 text-base font-medium hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-3 pt-8">
              <Button href={siteConfig.bookingUrl} size="lg" className="w-full">
                Book Appointment
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-sm font-semibold"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
