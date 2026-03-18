"use client";

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
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[36px] font-bold text-brand-dark-alt">
          Getting Started is Simple
        </h2>

        <div className="grid gap-16 md:gap-12 lg:gap-16">
          {/* First row - 3 items */}
          <div className="grid gap-12 md:grid-cols-3">
            {steps.slice(0, 3).map((step) => (
              <div key={step.number}>
                <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
                  {step.number}. {step.title}
                </h3>
                <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Second row - 2 items (centered) */}
          <div className="grid gap-12 md:grid-cols-2 lg:max-w-3xl">
            {steps.slice(3).map((step) => (
              <div key={step.number}>
                <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
                  {step.number}. {step.title}
                </h3>
                <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

