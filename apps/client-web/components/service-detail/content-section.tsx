"use client";

import { Check } from "lucide-react";

export function ContentSection(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Title */}
        <h2 className="mb-10 text-[29px] font-bold text-brand-dark-alt">
          Home Repair Services
        </h2>

        {/* Main content grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column - Text content */}
          <div>
            <h3 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
              Need a Hand with Home Repairs?
              <br />
              100Handy Has You Covered!
            </h3>
            <p className="mb-8 text-[20px] leading-relaxed text-brand-dark-alt">
              Need a quick fix or a skilled handyman for larger home repairs? 100Handy makes it easy to find trusted home repair services near you. Whether it's patching drywall, fixing a leaky faucet, or assembling furniture, Taskers are background-checked, reviewed, and ready to help.
            </p>

            <h3 className="mb-8 text-[39px] font-bold leading-tight text-brand-dark-alt">
              Why Choose 100Handy for Handyman Services?
            </h3>
            <p className="mb-4 text-[20px] leading-relaxed text-brand-dark-alt">
              <span className="font-bold">Trusted & Vetted Taskers</span> – Every handyman on 100Handy is background-checked, reviewed, and rated by real users.
            </p>
            <p className="mb-4 text-[20px] leading-relaxed text-brand-dark-alt">
              <span className="font-bold">Seamless Booking</span> – Find, hire, and pay your Tasker seamlessly through our secure platform.
            </p>
            <p className="mb-4 text-[20px] leading-relaxed text-brand-dark-alt">
              <span className="font-bold">Reliable Home Repairs</span> – From minor fixes to larger handyman projects, Taskers can help with a variety of home maintenance needs.
            </p>
            <p className="text-[20px] leading-relaxed text-brand-dark-alt">
              <span className="font-bold">Happiness Pledge</span> – We stand by the quality of our services. If something isn't right, we'll work to make it right.
            </p>
          </div>

          {/* Right column - Dark decorative card with shapes */}
          <div className="relative h-[351px] overflow-hidden rounded-3xl bg-brand-dark">
            {/* Decorative shapes */}
            <div className="absolute left-[15%] top-[25%] h-[101px] w-[101px] rounded-full bg-[#5A6357]/50" />
            <div
              className="absolute bottom-[15%] right-[20%] h-[205px] w-[238px] bg-[#5A6357]/50"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            />
          </div>
        </div>

        {/* What Kind of Home Repairs section */}
        <div className="mt-16">
          <h3 className="mb-6 text-[39px] font-bold leading-tight text-brand-dark-alt">
            What Kind of Home Repairs
            <br />
            Can a Tasker Help With?
          </h3>
          <p className="mb-6 text-[20px] text-brand-dark-alt">
            Taskers are skilled in a variety of home repair services, including:
          </p>
          
          <div className="space-y-4">
            <p className="text-[20px] text-brand-dark-alt">
              <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
              <span className="font-bold">Drywall repair</span> – Patching holes, smoothing out dents, and painting over fixes.
            </p>
            <p className="text-[20px] text-brand-dark-alt">
              <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
              <span className="font-bold">Furniture repair</span> – Fixing broken chairs, tables, and other household items.
            </p>
            <p className="text-[20px] text-brand-dark-alt">
              <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
              <span className="font-bold">Plumbing repair</span> – Stopping leaks, replacing faucets, and unclogging drains.
            </p>
            <p className="text-[20px] text-brand-dark-alt">
              <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
              <span className="font-bold">Electrical repairs</span> – Installing light fixtures, replacing switches, and minor wiring work.
            </p>
            <p className="text-[20px] text-brand-dark-alt">
              <Check className="mr-2 inline h-5 w-5 text-brand-dark-alt" strokeWidth={2} />
              <span className="font-bold">Mounting installations</span> – Hanging TVs, picture frames, curtains, and more.
            </p>
          </div>

          <p className="mt-8 text-[20px] text-brand-dark-alt">
            <span className="font-bold">General handyman tasks</span> – Fixing doors, repairing cabinets, installing shelves, and more.
          </p>

          <p className="mt-8 text-[20px] text-brand-dark-alt">
            No wonder more people trust 100Handy as the go-to solution for professional, affordable handyman services that fit your schedule.
          </p>

          <p className="mt-6 text-[20px] text-brand-dark-alt">
            A licensed contractor? Be sure to check your Tasker's qualifications when booking to ensure they meet your project's requirements.
          </p>
        </div>
      </div>
    </section>
  );
}

