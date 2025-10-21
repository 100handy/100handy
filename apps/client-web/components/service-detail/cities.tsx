"use client";

const citiesColumns = [
  ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Glasgow", "Edinburgh"],
  ["Bristol", "Sheffield", "Nottingham", "Leicester", "Newcastle upon Tyne"],
  ["Cardiff", "Belfast", "Coventry", "Brighton", "Southampton"],
  ["Reading", "Cambridge", "Oxford", "Norwich", "Exeter"],
];

export function Cities(): React.JSX.Element {
  return (
    <section className="bg-[#F5F3F1] py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-16 text-[39px] font-bold text-brand-dark-alt">
          Ready to hire a Tasker?
        </h2>

        <div className="grid gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          {citiesColumns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((city) => (
                <p
                  key={city}
                  className="text-[24px] text-brand-dark-alt hover:text-brand-terracotta transition-colors cursor-pointer"
                >
                  {city}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

