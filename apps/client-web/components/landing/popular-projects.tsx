"use client";

const projects = [
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
  { title: "Handy Assembly", price: "Projects starting at £36" },
];

export function LandingPopularProjects(): React.JSX.Element {
  return (
    <section className="bg-[#FAFAF9] py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[31px] font-medium text-brand-dark-alt">
          Popular Projects
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              {/* Project Image - Dark with geometric shapes */}
              <div className="relative mb-4 h-[180px] overflow-hidden rounded-xl bg-brand-dark">
                {/* Circle decoration */}
                <div className="absolute left-[25%] top-[35%] h-16 w-16 rounded-full bg-[#5A6357]/60" />
                {/* Triangle decoration */}
                <div 
                  className="absolute bottom-[20%] right-[25%] h-24 w-24 bg-[#5A6357]/60"
                  style={{ 
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }}
                />
              </div>

              {/* Project Info */}
              <h3 className="text-[19px] font-medium text-brand-dark-alt transition-colors group-hover:text-brand-terracotta">
                {project.title}
              </h3>
              <p className="mt-1 text-[16px] font-light text-brand-dark-alt">
                {project.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

