"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] touch-none select-none overflow-hidden rounded-xl bg-neutral-200 ${className}`}
      onPointerMove={(e) => e.buttons > 0 && updatePosition(e.clientX)}
      onPointerDown={(e) => updatePosition(e.clientX)}
      role="img"
      aria-label={`Before and after comparison: ${beforeAlt} versus ${afterAlt}`}
    >
      <Image src={afterSrc} alt={afterAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" draggable={false} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" draggable={false} />
      </div>

      <div
        className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-lg"
        style={{ left: `${position}%` }}
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary-900 text-white shadow-card">
          <span className="text-xs font-bold">↔</span>
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded bg-primary-900/85 px-2 py-1 text-xs font-semibold text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded bg-accent-500 px-2 py-1 text-xs font-semibold text-white">
        After
      </span>
    </div>
  );
}
