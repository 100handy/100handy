"use client";

import Image from "next/image";

interface ServiceHeroProps {
  title: string;
  description: string;
  heroImage?: string;
}

export function ServiceHero({ title, description, heroImage }: ServiceHeroProps): React.JSX.Element {
  return (
    <section className="relative bg-brand-dark py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative flex min-h-[470px] items-center justify-center">
          {heroImage ? (
            /* Real hero image background */
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={heroImage}
                alt={title}
                fill
                className="object-cover opacity-40"
                priority
                sizes="100vw"
              />
            </div>
          ) : (
            /* Fallback decorative shapes */
            <>
              <div className="absolute left-[10%] top-[15%] h-[217px] w-[218px] rounded-full bg-[#5A6357]/60" />
              <div
                className="absolute bottom-[5%] right-[8%] h-[442px] w-[512px] bg-[#5A6357]/60"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            </>
          )}

          {/* White info card - centered */}
          <div className="relative z-10 w-full max-w-[576px] rounded-2xl bg-white px-12 py-16 text-center shadow-xl">
            <h1 className="mb-6 text-[48px] font-bold leading-tight text-brand-dark-alt">
              {title}
            </h1>
            <p className="mb-8 text-[22px] leading-relaxed text-brand-dark-alt">
              {description}
            </p>
            <button className="rounded-full bg-brand-terracotta px-12 py-4 text-[22px] font-medium text-white transition-colors hover:bg-brand-terracotta/90">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
