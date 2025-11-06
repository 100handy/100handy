"use client";

const steps = [
  {
    number: 1,
    title: "Sign up",
    description: "Create your account. Then download the 100Handy app to continue registration.",
  },
  {
    number: 2,
    title: "Build your profile",
    description: "Select what services you want to offer and where.",
  },
  {
    number: 3,
    title: "Verify your eligibility to task",
    description: "Build a level of trust you want to offer and where.",
  },
  {
    number: 4,
    title: "Set your schedule and work area",
    description: "Set your weekly availability and opt in to receive same-day jobs.",
  },
  {
    number: 5,
    title: "Start getting jobs",
    description: "Grow your business on your own terms.",
  },
];

export function GettingStarted(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[36px] font-bold text-brand-dark-alt">
          Getting Started
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

