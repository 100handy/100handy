"use client";

const mainCategories = [
  { name: "Assembly", active: true },
  { name: "Mounting", active: false },
  { name: "Home Repairs", active: false },
  { name: "Plumbing", active: false },
  { name: "Electrical", active: false },
  { name: "Cleaning", active: false },
  { name: "Moving", active: false },
  { name: "Outdoor Help", active: false },
];

const subCategories = [
  "Furniture Assembly",
  "Garden Assembly",
  "Office Furniture Assembly",
  "Bed Assembly",
  "Wardrobe Assembly",
  "Crib Assembly",
];

export function LandingServices(): React.JSX.Element {
  return (
    <section className="border-y border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-[1920px] px-8">
        {/* Main Categories with Icons Above */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {mainCategories.map((category) => (
              <button
                key={category.name}
                className="group flex flex-col items-center gap-2"
              >
                {/* Circle Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    category.active
                      ? "bg-brand-terracotta/10"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${
                      category.active ? "bg-brand-terracotta" : "bg-gray-400"
                    }`}
                  />
                </div>
                {/* Category Name */}
                <span
                  className={`whitespace-nowrap text-[16px] transition-colors ${
                    category.active
                      ? "font-bold text-brand-terracotta"
                      : "font-medium text-brand-dark-alt hover:text-brand-terracotta"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gray-200" />

        {/* Sub Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {subCategories.map((subCategory) => (
            <button
              key={subCategory}
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
            >
              {subCategory}
            </button>
          ))}
        </div>

        {/* See All Services Link */}
        <div className="mt-6 text-center">
          <button className="text-[16px] font-bold text-brand-terracotta underline decoration-brand-terracotta underline-offset-4 transition-colors hover:text-brand-terracotta/80">
            See All Services
          </button>
        </div>
      </div>
    </section>
  );
}

