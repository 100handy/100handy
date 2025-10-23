"use client";

export function WhatsHappening(): React.JSX.Element {
  return (
    <section className="bg-brand-cream py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
              What's happening at<br />
              100 Handy
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-brand-dark-alt">
              We bring people together. It's at the heart of everything we do. We know that for every job done well, there's a customer who's happy and a Tasker who's proud.
            </p>
            <button className="rounded-full bg-brand-terracotta px-8 py-3 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
              Read the Blog
            </button>
          </div>

          {/* Right side - Decorative card with border */}
          <div className="rounded-3xl bg-brand-cream p-2">
            <div className="relative h-[400px] overflow-hidden rounded-[20px] bg-brand-dark">
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
      </div>
    </section>
  );
}

