"use client";

const guarantees = [
  {
    title: "Satisfaction Guaranteed",
    description: "We stand by our work. If you're not happy, we'll do everything we can to make it right.",
    icon: (
      <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Happiness Pledge",
    description: "Your peace of mind matters. We're committed to delivering a service that leaves you smiling every time.",
    icon: (
      <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "ID-Checked Pros",
    description: "Every professional on our platform is identity-verified before they join—so you can trust who's coming to your home.",
    icon: (
      <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Dedicated Support",
    description: "Need a hand or have a question? Our friendly support team is here for you, every day of the week.",
    icon: (
      <svg className="h-8 w-8 text-brand-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export function Guarantees() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-4 text-center text-[34px] font-bold text-[#30352D]">
          Peace of Mind, <span className="text-brand-terracotta">Always</span>
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((guarantee) => (
            <div key={guarantee.title}>
              <div className="mb-4 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  {guarantee.icon}
                </div>
              </div>
              <h3 className="mb-3 text-center text-[24px] font-medium text-[#30352D]">
                {guarantee.title}
              </h3>
              <p className="text-center text-[16px] leading-relaxed text-black">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
