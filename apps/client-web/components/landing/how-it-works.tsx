"use client";

const steps = [
  {
    number: 1,
    title: "Choose a 100 Handy Pro by price, skills, and reviews.",
  },
  {
    number: 2,
    title: "Schedule your job as early as today.",
  },
  {
    number: 3,
    title: "Chat, pay, tip, and review, all in one place.",
  },
];

export function LandingHowItWorks(): React.JSX.Element {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="relative h-[420px] overflow-hidden rounded-3xl">
          {/* Green-tinted beige background */}
          <div className="absolute inset-0 bg-[#D4DCC8]" />
          
          {/* Dark green section on the right */}
          <div className="absolute right-0 top-0 h-full w-[58%] rounded-l-[50px] bg-[#3C423B]">
            {/* Circle decoration */}
            <div className="absolute left-[20%] top-[30%] h-32 w-32 rounded-full bg-[#5A6357]/50" />
            {/* Triangle decoration */}
            <div 
              className="absolute bottom-[20%] right-[25%] h-44 w-44 bg-[#5A6357]/50"
              style={{ 
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>

          {/* White info card */}
          <div className="absolute left-8 top-1/2 z-10 w-[320px] -translate-y-1/2 rounded-2xl bg-white p-7 shadow-xl">
            <h3 className="mb-6 text-[27px] font-bold text-brand-dark-alt">
              How it works
            </h3>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[16px] font-bold text-white">
                    {step.number}
                  </div>
                  <p className="pt-2 text-[16px] font-medium leading-snug text-brand-dark-alt">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

