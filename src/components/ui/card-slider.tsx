"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardSlider({
  children,
  className,
  controlsLabel = "courses",
}: {
  children: ReactNode;
  className?: string;
  controlsLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const itemCount = Children.count(children);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateControls = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      setCanScrollPrevious(scroller.scrollLeft > 4);
      setCanScrollNext(scroller.scrollLeft < maxScroll - 4);
    };

    updateControls();
    scroller.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    return () => {
      scroller.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [itemCount]);

  const scroll = (direction: "previous" | "next") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction === "next" ? scroller.clientWidth : -scroller.clientWidth,
      behavior: "smooth",
    });
  };

  const showControls = canScrollPrevious || canScrollNext;

  return (
    <div className={cn("relative", className)}>
      {showControls ? (
        <div className="mb-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll("previous")}
            disabled={!canScrollPrevious}
            aria-label={`Previous ${controlsLabel}`}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border-default)] bg-white text-[color:var(--text-heading)] shadow-sm transition hover:border-[color:var(--brand-secondary)] hover:text-[color:var(--brand-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            disabled={!canScrollNext}
            aria-label={`Next ${controlsLabel}`}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border-default)] bg-[color:var(--brand-secondary)] text-white shadow-sm transition hover:bg-[color:var(--brand-secondary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div
        ref={scrollerRef}
        className="grid auto-cols-[minmax(0,100%)] grid-flow-col gap-6 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory sm:auto-cols-[calc((100%-1.5rem)/2)] lg:auto-cols-[calc((100%-3rem)/3)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="min-w-0 snap-start">{child}</div>
        ))}
      </div>
    </div>
  );
}
