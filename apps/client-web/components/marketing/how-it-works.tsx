"use client";

import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Find Your Expert",
    description: "Tell us what you need. Browse profiles, check ratings, and compare transparent pricing to find the perfect pro.",
  },
  {
    number: 2,
    title: "Book Instantly",
    description: "Select a date and time that fits your busy schedule. No phone tag, no waiting windows.",
  },
  {
    number: 3,
    title: "Relax & Enjoy",
    description: "Your pro arrives fully equipped to handle the job. Payment is released securely only when the work is done.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left - Steps card */}
          <div className="rounded-2xl bg-brand-cream/40 p-8 md:p-10">
            <h3 className="mb-8 text-[28px] font-bold text-brand-dark-alt">
              Home Improvement in 3 Steps
            </h3>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[16px] font-bold text-white">
                    {step.number}
                  </div>
                  <div className="pt-1">
                    <p className="text-[17px] font-semibold text-brand-dark-alt">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-brand-dark-alt/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/home/home-improvement-3steps.jpeg"
              alt="Home Improvement in 3 Steps - Find your expert, book instantly, relax and enjoy"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
