"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    title: "Dare to Innovate",
    description:
      "We don't settle for \"good enough.\" We approach every problem with fresh eyes and fearless curiosity. We aren't afraid to break things if it means building something better. Failure is just data gathering for the next big win.",
  },
  {
    title: "Win as One Team",
    description:
      "We check our egos at the door. We work passionately under one roof (physical or digital), elevating our peers and inspiring trust. We are kind, candid, and assume good intent. When one of us wins, we all win.",
  },
  {
    title: "Own the Outcome",
    description:
      "We are all responsible for the success of 100 Handy. We don't pass the buck. We take smart risks, make decisions faster, and deliver results that make a lasting impact on our business and the planet.",
  },
  {
    title: "Simplicity is Speed",
    description:
      "Complex problems require simple solutions. We value momentum over perfection. We strive to strip away the noise and focus on what truly matters to get our mission to more people, faster.",
  },
  {
    title: "Champion the User",
    description:
      "Our community is the heartbeat of our company. We build solutions that start with the customer's needs. We are a force for good and we make every decision with Clients and Pros in mind.",
  },
];

export function ValuesCarousel(): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.scrollWidth / values.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, values.length - 1));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => container.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.scrollWidth / values.length;
    container.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  }, []);

  const scrollPrev = useCallback(() => {
    scrollTo(Math.max(activeIndex - 1, 0));
  }, [activeIndex, scrollTo]);

  const scrollNext = useCallback(() => {
    scrollTo(Math.min(activeIndex + 1, values.length - 1));
  }, [activeIndex, scrollTo]);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-[36px] font-bold text-brand-dark-alt">
              We live by our values.
            </h2>
            <p className="mt-4 text-[18px] italic text-brand-dark-alt/80">
              Our culture is our operating system. It guides how we hire, how we
              build, and how we treat each other.
            </p>
          </div>

          {/* Carousel container */}
          <div className="relative">
            {/* Previous button */}
            <button
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              aria-label="Previous value"
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white md:flex"
            >
              <ChevronLeft className="h-5 w-5 text-brand-dark-alt" />
            </button>

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="w-[85%] flex-shrink-0 snap-start rounded-2xl bg-white p-8 shadow-sm sm:w-[70%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-terracotta/10 text-[16px] font-bold text-brand-terracotta">
                    {index + 1}
                  </div>
                  <h3 className="mb-4 text-[24px] font-bold text-brand-dark-alt">
                    {value.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-brand-dark-alt/80">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={scrollNext}
              disabled={activeIndex === values.length - 1}
              aria-label="Next value"
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white md:flex"
            >
              <ChevronRight className="h-5 w-5 text-brand-dark-alt" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {values.map((value, index) => (
              <button
                key={value.title}
                onClick={() => scrollTo(index)}
                aria-label={`Go to value ${index + 1}: ${value.title}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-brand-terracotta"
                    : "w-2.5 bg-brand-dark-alt/20 hover:bg-brand-dark-alt/40"
                }`}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="terracotta" size="lg" asChild>
              <a href="#open-roles">See Open Roles</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
