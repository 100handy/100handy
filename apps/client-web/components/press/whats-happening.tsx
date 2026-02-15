"use client";

export function WhatsHappening(): React.JSX.Element {
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-[32px] font-bold leading-tight text-brand-dark-alt">
              What's happening at<br />
              100 Handy
            </h2>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              We bring people together. It's at the heart of everything we do. We know that for every person who needs their radiator fixed before winter, the nursery set up for their newborn, or a TV mounted in time for game day, there's someone nearby who is ready, willing, and able to help.
            </p>
            <button className="rounded-md bg-brand-terracotta px-6 py-2.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/90">
              Read the Blog
            </button>
          </div>

          {/* Right side - Decorative card with border */}
          <div className="rounded-3xl bg-[#F5F0E8] p-2">
            <div className="relative h-[400px] overflow-hidden rounded-[20px] bg-[#3D4539]">
              {/* Decorative shapes */}
              <div className="absolute right-[30%] top-[25%] h-32 w-32 rounded-full bg-[#5A6357]/60" />
              <div
                className="absolute bottom-[20%] right-[20%] h-44 w-44 bg-[#6B7564]/60"
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

