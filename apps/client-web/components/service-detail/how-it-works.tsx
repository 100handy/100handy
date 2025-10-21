"use client";

// import Image from "next/image"; // Uncomment when actual images are added

const steps = [
  {
    number: 1,
    title: "Describe Your Task",
    description: "Tell us what you need done, when and where it works for you.",
    imagePath: "/images/how-it-works-1.png",
    imageWidth: 141,
    imageHeight: 141,
  },
  {
    number: 2,
    title: "Choose Your Tasker",
    description: "Browse trusted Taskers by skills, reviews, and price. Chat with them to confirm details.",
    imagePath: "/images/how-it-works-2.png",
    imageWidth: 192,
    imageHeight: 192,
  },
  {
    number: 3,
    title: "Get It Done!",
    description: "Your Tasker arrives and gets the job done. Pay securely and leave a review, all through 100Handy.",
    imagePath: "/images/how-it-works-3.png",
    imageWidth: 182,
    imageHeight: 182,
  },
];

export function ServiceHowItWorks(): React.JSX.Element {
  return (
    <section className="bg-[#F5F3F1] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-center text-[39px] font-bold text-brand-dark-alt">
          How it works
        </h2>

        <div className="grid gap-16 md:grid-cols-3">
          {steps.map((step) => {
            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Illustration image placeholder */}
                <div className="mb-8 flex items-center justify-center">
                  <div 
                    className="rounded-2xl bg-gradient-to-br from-brand-cream/50 to-gray-200/50 flex items-center justify-center"
                    style={{
                      width: step.imageWidth,
                      height: step.imageHeight,
                    }}
                  >
                    {/* Placeholder for actual image */}
                    <div className="text-4xl text-gray-400">🔧</div>
                  </div>
                </div>

                {/* Step number badge - separate line */}
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-terracotta">
                  <span className="text-[18px] font-bold text-white">{step.number}</span>
                </div>

                {/* Title */}
                <h3 className="mb-4 text-center text-[24px] font-bold text-brand-dark-alt">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-center text-[20px] leading-relaxed text-brand-dark-alt">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

