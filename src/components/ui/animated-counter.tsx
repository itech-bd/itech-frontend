"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({
  value,
  locale,
  suffix = "",
}: {
  value: number;
  locale: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value <= 0 ? value : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (value <= 0) return;

    if (prefersReducedMotion) {
      const reducedFrame = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(reducedFrame);
    }

    let frame = 0;
    let started = false;
    const duration = 850;

    const animate = (start: number) => {
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate(performance.now());
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {new Intl.NumberFormat(locale).format(displayValue)}
      {suffix}
    </span>
  );
}
