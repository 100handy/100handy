"use client";

export function TaskerTestimonial(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Testimonial */}
          <div>
            <p className="text-[24px] font-medium leading-relaxed text-brand-dark-alt">
              "100Handy has allowed me to overcome the fear of talking to customers and taught me to always do more than the customer expects. I have more flexibility now and more time to stay with my family."
            </p>
            <p className="mt-6 text-[24px] font-medium text-brand-dark-alt">
              — Berkay W., London
            </p>
          </div>

          {/* Right side - Dark decorative card */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl bg-brand-dark">
            {/* Decorative shapes */}
            <div className="absolute right-[30%] top-[25%] h-32 w-32 rounded-full bg-[#5A6357]/50" />
            <div
              className="absolute bottom-[20%] right-[20%] h-44 w-44 bg-[#5A6357]/50"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

