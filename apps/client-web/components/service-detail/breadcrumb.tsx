"use client";

import Link from "next/link";

interface BreadcrumbProps {
  category: string;
  service: string;
  categorySlug: string;
}

export function Breadcrumb({ category, service, categorySlug }: BreadcrumbProps): React.JSX.Element {
  return (
    <div className="bg-white py-6">
      <div className="mx-auto max-w-[1920px] px-8">
        <p className="text-[20px] text-brand-dark-alt/80">
          <Link href="/" className="hover:text-brand-terracotta transition-colors">Home</Link>
          {" > "}
          <Link href="/services" className="hover:text-brand-terracotta transition-colors">Services</Link>
          {" > "}
          <Link href={`/services#${categorySlug}`} className="hover:text-brand-terracotta transition-colors">{category}</Link>
          {" > "}
          <span>{service}</span>
        </p>
      </div>
    </div>
  );
}

