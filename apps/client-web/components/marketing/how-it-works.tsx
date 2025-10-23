"use client";

const steps = [
  {
    number: 1,
    title: "Choose a Tasker by price, reviews, and skills",
  },
  {
    number: 2,
    title: "Schedule at no-obligation chat",
  },
  {
    number: 3,
    title: "Chat, play, bill, review, done",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16">
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
            <h3 className="mb-6 text-[24px] font-medium text-[#30352D]">
              How it works
            </h3>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[14px] font-bold text-white">
                    {step.number}
                  </div>
                  <p className="pt-1.5 text-[14px] leading-snug text-[#30352D]">
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
