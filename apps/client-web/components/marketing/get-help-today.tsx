import Link from "next/link";

const services = [
  { name: "Furniture Assembly", href: "/services/furniture-assembly/furniture-assembly" },
  { name: "TV Mounting", href: "/services/tv-wall-mounting/tv-wall-mounting" },
  { name: "Install Curtains and Blinds", href: "/services/tv-wall-mounting/install-curtains-blinds" },
  { name: "Plumbing", href: "/services/plumbing/plumbing" },
  { name: "Light Installation", href: "/services/electrical/light-installation" },
  { name: "Deep Cleaning", href: "/services/cleaning/deep-cleaning" },
  { name: "Gardening", href: "/services/outdoor/gardening" },
  { name: "Gutter Cleaning", href: "/services/outdoor/gutter-cleaning" },
  { name: "Hang Pictures", href: "/services/tv-wall-mounting/hang-pictures" },
  { name: "Bed Assembly", href: "/services/furniture-assembly/bed-assembly" },
  { name: "Wardrobe Assembly", href: "/services/furniture-assembly/wardrobe-assembly" },
  { name: "Home Repairs", href: "/services/home-repairs/home-repairs" },
];

export function GetHelpToday() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1920px] px-8">
        <h2 className="mb-12 text-center text-[34px] font-bold text-brand-dark-alt">
          Get help today
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[16px] font-medium text-brand-dark-alt transition-all hover:border-brand-terracotta hover:text-brand-terracotta"
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
            See All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
