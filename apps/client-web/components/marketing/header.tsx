"use client";

import Link from "next/link";
import { UserMenu } from "@/components/auth/user-menu";

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

        {/* Right Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/services"
            className="text-[16px] font-medium text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Services
          </Link>
          <Link
            href="/sign-in"
            className="text-[16px] font-medium text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Sign up / Log in
          </Link>
          <Link
            href="/become-tasker"
            className="px-4 py-2 rounded-md bg-brand-terracotta text-white font-medium text-[16px] hover:bg-brand-terracotta/90 transition-colors"
          >
            Become a Tasker
          </Link>
        </nav>
      </div>
    </header>
  );
}
