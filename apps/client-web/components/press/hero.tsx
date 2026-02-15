"use client";

export function PressHero(): React.JSX.Element {
  return (
    <section className="relative bg-[#3D4539] py-32">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative flex min-h-[400px] items-center justify-center">
          {/* Decorative shapes - matching Figma design */}
          <div className="absolute left-1/2 top-[15%] h-36 w-36 -translate-x-36 rounded-full bg-[#5A6357]/70" />
          <div
            className="absolute bottom-[10%] right-1/2 h-48 w-48 translate-x-20 bg-[#6B7564]/70"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-8 text-[67px] font-bold leading-none text-white">
              Press
            </h1>
            <button className="rounded-md bg-brand-terracotta px-6 py-2.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
              Get the latest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

