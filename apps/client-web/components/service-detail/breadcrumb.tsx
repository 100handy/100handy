"use client";

import Link from "next/link";

export function Breadcrumb(): React.JSX.Element {
  return (
    <div className="bg-white py-6">
      <div className="mx-auto max-w-[1920px] px-8">
        <p className="text-[20px] text-brand-dark-alt/80">
          <Link href="/" className="hover:text-brand-terracotta transition-colors">Home</Link>
          {" > "}
          <Link href="/services" className="hover:text-brand-terracotta transition-colors">Services</Link>
          {" > "}
          <Link href="/services/handyman" className="hover:text-brand-terracotta transition-colors">Handyman</Link>
          {" > "}
          <span>Home Repairs</span>
        </p>
      </div>
    </div>
  );
}

