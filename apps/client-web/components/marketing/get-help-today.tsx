import Link from "next/link";

const services = [
  { name: "Furniture Assembly", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "TV Mounting", href: "/services/tv-wall-mounting/tv-mounting" },
  { name: "Install Curtains and Blinds", href: "/services/tv-wall-mounting/curtains-and-blinds" },
  { name: "Plumbing", href: "/services/plumbing/leak-fixing" },
  { name: "Light Installation", href: "/services/electrical/light-installation" },
  { name: "Deep Cleaning", href: "/services/cleaning/deep-clean" },
  { name: "Gardening", href: "/services/outdoor/gardening" },
  { name: "Gutter Cleaning", href: "/services/outdoor/roof-gutter-cleaning" },
  { name: "Hang Pictures", href: "/services/tv-wall-mounting/hanging-pictures" },
  { name: "IKEA Assembly", href: "/services/furniture-assembly/ikea-assembly" },
  { name: "Wardrobe Assembly", href: "/services/furniture-assembly/wardrobe-assembly" },
  { name: "Home Repairs", href: "/services/home-repairs/home-repairs" },
];

interface GetHelpTodayProps {
  title?: string;
  services?: Array<{ name: string; href: string }>;
  ctaText?: string;
}

export function GetHelpToday({
  title = "Get Help Today",
  services: serviceItems = services,
  ctaText = "See All Services",
}: GetHelpTodayProps) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[34px] font-bold text-brand-dark-alt">
          {title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {serviceItems.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[14px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
            >
              {service.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="text-[16px] font-bold text-brand-terracotta underline decoration-brand-terracotta underline-offset-4 transition-colors hover:text-brand-terracotta/80"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
