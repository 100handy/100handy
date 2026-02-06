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
              What is 100 Handy?
            </h2>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              100 Handy connects customers who need help with skilled local Pros - like you. From home repairs and mounting to cleaning and moving help, we make it simple for people to book services they can trust.
            </p>
            <p className="mt-4 text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              You bring the skills. We help you get discovered, manage bookings, and get paid securely - so you can focus on doing great work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

