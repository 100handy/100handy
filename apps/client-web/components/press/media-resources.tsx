"use client";

const resources = [
  { title: "Download Logos", href: "mailto:press@100handy.com" },
  { title: "Download B-Roll", href: "mailto:press@100handy.com" },
  { title: "Download Fact Sheet", href: "mailto:press@100handy.com" },
  { title: "Download 100 Handy Pro Images", href: "mailto:press@100handy.com" },
  { title: "Download Product Images", href: "mailto:press@100handy.com" },
  { title: "Download Client Images", href: "mailto:press@100handy.com" },
];

export function MediaResources(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-6 text-center text-[32px] font-bold text-brand-dark-alt">
          Media Resources
        </h2>

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-[20px] text-brand-dark-alt">
            A collection of brand assets for your use.
          </p>
          <p className="text-[20px] text-brand-dark-alt">
            All logo and media usage must follow the 100 Handy brand guidelines. For specific media requests, please contact{" "}
            <a href="mailto:press@100handy.com" className="text-brand-terracotta underline hover:text-brand-terracotta/85">
              press@100handy.com
            </a>
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.href}
              className="flex items-center justify-center rounded-2xl bg-brand-terracotta px-8 py-10 text-center transition-all hover:bg-brand-terracotta/90"
            >
              <span className="text-[20px] font-bold text-white underline">
                {resource.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

