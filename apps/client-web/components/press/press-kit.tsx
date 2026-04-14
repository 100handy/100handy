"use client";

import { Logo } from "@/components/ui/logo";

export function PressKit(): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-16 md:grid-cols-[1fr_1.5fr]">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <Logo size="xl" />
            </div>

            {/* Content */}
            <div>
              <h2 className="mb-6 text-[32px] font-bold text-brand-dark-alt">
                Press Kit
              </h2>
              <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
                Download 100Handy logos, brand visuals, and app screenshots.
              </p>
              <button className="rounded-full bg-brand-terracotta px-6 py-2.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
                Download press kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

