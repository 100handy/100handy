"use client";

import Image from "next/image";

export function WhatIsHandy(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Left side - Illustration */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl">
            <Image
              src="/images/become-tasker/what-is-100handy.jpeg"
              alt="What is 100 Handy?"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
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

