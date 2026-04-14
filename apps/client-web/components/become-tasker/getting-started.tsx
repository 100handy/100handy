"use client";

import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Sign up",
    description: "Create your account in minutes with your email or social login.",
  },
  {
    number: 2,
    title: "Build your profile",
    description: "Add your skills, experience, service areas, and a friendly intro. A strong profile helps you win more bookings.",
  },
  {
    number: 3,
    title: "Verify your eligibility to task",
    description: "Complete identity checks and any requirements needed for your location and categories.",
  },
  {
    number: 4,
    title: "Set your schedule and work area",
    description: "Choose your availability and where you want to work - near home, across the city, or both.",
  },
  {
    number: 5,
    title: "Start getting jobs",
    description: "Receive requests, accept the work that fits, show up prepared, and get paid when the job is done.",
  },
];

export function GettingStarted(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#D4DCC8]">
          {/* Image on the right */}
          <div className="absolute right-0 top-0 hidden h-full w-[52%] overflow-hidden rounded-l-[50px] lg:block">
            <Image
              src="/images/become-tasker/what-is-100handy.jpeg"
              alt="Getting started as a 100 Handy Pro"
              fill
              className="object-cover"
              sizes="52vw"
            />
          </div>

          {/* White info card on the left */}
          <div className="relative z-10 m-8 rounded-2xl bg-white p-8 shadow-xl lg:m-10 lg:w-[44%]">
            <h2 className="mb-6 text-[24px] font-bold text-brand-dark-alt">
              Getting Started is Simple
            </h2>
            <div className="space-y-5">
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
