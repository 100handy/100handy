"use client";

import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Choose a Service",
    description: "Browse our categories and pick exactly the help you need — from furniture assembly to outdoor work.",
  },
  {
    number: 2,
    title: "Tell Us What You Need",
    description: "Describe your task, share photos if helpful, and let us know when you'd like it done.",
  },
  {
    number: 3,
    title: "Get Matched With a Pro",
    description: "We connect you with a vetted, local 100 Handy Pro who has the right skills for your job.",
  },
  {
    number: 4,
    title: "Book Your Time Slot",
    description: "Pick a date and time that works for you. Schedule as early as today — no phone tag, no waiting.",
  },
  {
    number: 5,
    title: "Sit Back & Relax",
    description: "Your pro arrives ready to work. Payment is released only once the job is done to your satisfaction.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative h-[420px] overflow-hidden rounded-3xl">
          {/* Green-tinted beige background */}
          <div className="absolute inset-0 bg-[#D4DCC8]" />

          {/* Illustration on the right */}
          <div className="absolute right-0 top-0 h-full w-[58%] overflow-hidden rounded-l-[50px]">
            <Image
              src="/images/home/home-improvement-3steps.jpeg"
              alt="Home Improvement in 3 Steps"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </div>

          {/* White info card */}
          <div className="absolute left-8 top-1/2 z-10 w-[420px] -translate-y-1/2 rounded-2xl bg-white p-7 shadow-xl">
            <h3 className="mb-6 text-[24px] font-medium text-brand-dark-alt">
              Getting Started is Simple
            </h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[14px] font-bold text-white">
                    {step.number}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[15px] font-semibold text-brand-dark-alt">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-brand-dark-alt/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
