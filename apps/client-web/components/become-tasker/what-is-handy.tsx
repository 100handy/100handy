"use client";

export function WhatIsHandy(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Left side - Dark decorative card */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl bg-brand-dark">
            {/* Decorative shapes */}
            <div className="absolute left-[25%] top-[30%] h-32 w-32 rounded-full bg-[#5A6357]/50" />
            <div
              className="absolute bottom-[20%] right-[25%] h-44 w-44 bg-[#5A6357]/50"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="mb-6 text-[28px] font-bold text-brand-dark-alt">
              What is 100Handy?
            </h2>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              100Handy connects busy people in need of help with trusted local professionals who can lend a hand with everything from home repairs to errands. As a Handy Pro, you can get paid to do what you love, when and where you want — all while helping others in your community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

