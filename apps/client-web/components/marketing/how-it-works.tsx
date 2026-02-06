"use client";

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
          <div className="absolute left-8 top-1/2 z-10 w-[380px] -translate-y-1/2 rounded-2xl bg-white p-7 shadow-xl">
            <h3 className="mb-6 text-[24px] font-medium text-[#30352D]">
              Home Improvement in 3 Steps
            </h3>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-terracotta text-[14px] font-bold text-white">
                    {step.number}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[15px] font-semibold text-[#30352D]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-[#30352D]/70">
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
