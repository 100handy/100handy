"use client";

export function FlexibleWork(): React.JSX.Element {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <p className="mx-auto mb-16 max-w-3xl text-center text-[23px] font-medium leading-relaxed text-brand-dark-alt">
          Find local jobs that fit your skills and schedule. With 100 Handy, you have the freedom and support to be your own boss.
        </p>

        <div className="grid gap-16 md:grid-cols-3">
          {/* Be your own boss */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Be your own boss
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area. You are in control of your time.
            </p>
          </div>

          {/* Set your own rates */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Set your own rates
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              You know what your skills are worth. You set your hourly rate, and you keep 100% of your tips. We handle the invoicing so you get paid directly and securely.
            </p>
          </div>

          {/* Grow your business */}
          <div>
            <h3 className="mb-4 text-[28px] font-bold text-brand-dark-alt">
              Grow your business
            </h3>
            <p className="text-[18px] font-medium leading-relaxed text-brand-dark-alt">
              We connect you with clients in your area and give you the tools to market yourself. Say goodbye to advertising costs - focus on what you do best, and we&apos;ll bring the work to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

