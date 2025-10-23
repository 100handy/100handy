"use client";

export function FlexibleWork(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-6 text-center text-[36px] font-bold text-brand-dark-alt">
          Flexible work, at your fingertips
        </h2>
        <p className="mx-auto mb-16 max-w-3xl text-center text-[23px] font-medium leading-relaxed text-brand-dark-alt">
          Find local jobs that fit your skills and schedule. With 100Handy, you have the freedom and support to be your own boss.
        </p>

        <div className="grid gap-16 md:grid-cols-3">
          {/* Be your own boss */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Be your own boss
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area.
            </p>
          </div>

          {/* Set your own rates */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Set your own rates
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              You keep 100% of what you charge, plus tips! Invoice and get paid directly through our secure payment system.
            </p>
          </div>

          {/* Grow your business */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Grow your business
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              We connect you with clients in your area and provide tools to market yourself — so you can focus on what you do best.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

