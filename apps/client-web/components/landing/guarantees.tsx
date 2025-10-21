"use client";

export function LandingGuarantees(): React.JSX.Element {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-4 text-center text-[34px] font-bold text-brand-dark-alt">
          Your satisfaction, <span className="text-brand-terracotta">guaranteed</span>
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {/* Happiness Pledge */}
          <div>
            <div className="mb-6 flex items-center justify-center">
              {/* Green Shield Badge */}
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg className="h-20 w-20 text-brand-sage" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <svg className="absolute h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-3 text-center text-[27px] font-medium text-brand-dark-alt">
              Happiness Pledge
            </h3>
            <p className="text-center text-[17px] leading-relaxed text-black">
              If you're not satisfied, we'll work to make it right.
            </p>
          </div>

          {/* ID-Checked Taskers */}
          <div>
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-3 text-center text-[27px] font-medium text-brand-dark-alt">
              ID- Checked Taskers
            </h3>
            <p className="text-center text-[17px] leading-relaxed text-black">
              Taskers are always identity checked before joining the platform.
            </p>
          </div>

          {/* Dedicated Support */}
          <div>
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-3 text-center text-[27px] font-medium text-brand-dark-alt">
              Dedicated Support
            </h3>
            <p className="text-center text-[17px] leading-relaxed text-black">
              Friendly service when you need us – every day of the week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

