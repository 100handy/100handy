"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

interface PressKitProps {
  title: string;
  description: string;
  ctaText: string;
}

export function PressKit({
  title,
  description,
  ctaText,
}: PressKitProps): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-16 md:grid-cols-[1fr_1.5fr]">
            <div className="flex items-center justify-center">
              <Logo size="xl" />
            </div>

            <div>
              <h2 className="mb-6 text-[32px] font-bold text-brand-dark-alt">
                {title}
              </h2>
              <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
                {description}
              </p>
              <Button variant="terracotta" size="md" className="font-bold">
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
