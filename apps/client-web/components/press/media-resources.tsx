"use client";

interface MediaResourceItem {
  title: string;
  href: string;
}

interface MediaResourcesProps {
  title: string;
  introOne: string;
  introTwo: string;
  resources: MediaResourceItem[];
}

export function MediaResources({
  title,
  introOne,
  introTwo,
  resources,
}: MediaResourcesProps): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-6 text-center text-[32px] font-bold text-brand-dark-alt">
          {title}
        </h2>

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-2 text-[20px] text-brand-dark-alt">
            {introOne}
          </p>
          <p className="text-[20px] text-brand-dark-alt">
            {introTwo}
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
