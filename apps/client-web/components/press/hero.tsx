"use client";

export function PressHero(): React.JSX.Element {
  return (
    <section className="relative bg-brand-dark py-24">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative flex min-h-[300px] items-center justify-center">
          {/* Decorative shapes */}
          <div className="absolute left-1/2 top-[20%] h-28 w-28 -translate-x-32 rounded-full bg-[#5A6357]/60" />
          <div
            className="absolute bottom-[15%] right-1/2 h-40 w-40 translate-x-16 bg-[#5A6357]/60"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-8 text-[72px] font-bold text-white">
              Press
            </h1>
            <button className="rounded-full bg-brand-terracotta px-8 py-3 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
              Get the latest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

