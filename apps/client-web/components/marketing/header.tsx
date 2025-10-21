"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[70px] max-w-[1920px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-[16px] font-bold text-gray-900">
            100<span className="font-normal">HANDY</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/services"
            className="text-[16px] font-bold text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Services
          </Link>
          <Link
            href="/sign-in"
            className="text-[16px] font-bold text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Sign up / Log in
          </Link>
        </nav>

        {/* Become a Tasker Button */}
        <Link
          href="/become-tasker"
          className="rounded-md border-2 border-brand-terracotta bg-white px-6 py-2 text-[16px] font-bold text-brand-terracotta transition-colors hover:bg-brand-terracotta/5"
        >
          Become a Tasker
        </Link>
      </div>
    </header>
  );
}
