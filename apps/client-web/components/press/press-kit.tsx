"use client";

export function PressKit(): React.JSX.Element {
  return (
    <section className="bg-brand-cream py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-16 md:grid-cols-[1fr_1.5fr]">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <h2 className="text-[56px] font-bold tracking-tight text-brand-dark-alt">
                100<span className="font-light">HANDY</span>
              </h2>
            </div>

            {/* Content */}
            <div>
              <h2 className="mb-6 text-[39px] font-bold text-brand-dark-alt">
                Press Kit
              </h2>
              <p className="mb-8 text-[16px] leading-relaxed text-brand-dark-alt">
                Download 100Handy logos, brand visuals, and app screenshots.
              </p>
              <button className="rounded-full bg-brand-terracotta px-8 py-3 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
                Download press kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

