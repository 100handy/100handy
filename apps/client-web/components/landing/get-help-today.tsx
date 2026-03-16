"use client";

const services = [
  "Furniture Assembly",
  "Garden Assembly",
  "Office Furniture Assembly",
  "Bed Assembly",
  "Wardrobe Assembly",
  "Garden Assembly",
  "Crib Assembly",
  "Hang Pictures",
  "Bed Assembly",
  "Garden",
  "Garden Assembly",
  "Garden Assembly",
];

export function LandingGetHelpToday(): React.JSX.Element {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[34px] font-bold text-brand-dark-alt">
          Get help today
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {services.map((service, index) => (
            <button
              key={index}
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
            >
              {service}
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="text-[16px] font-bold text-brand-terracotta underline decoration-brand-terracotta underline-offset-4 transition-colors hover:text-brand-terracotta/80">
            See All Services
          </button>
        </div>
      </div>
    </section>
  );
}

