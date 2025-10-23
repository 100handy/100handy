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

        {/* Center Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/services"
            className="text-[16px] font-bold text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Services
          </Link>
          <Link
            href="/become-tasker"
            className="text-[16px] font-bold text-[#30352D] transition-colors hover:text-brand-terracotta"
          >
            Become a Tasker
          </Link>
        </nav>

        {/* User Menu - Shows Sign In/Up or User Profile */}
        <UserMenu />
      </div>
    </header>
  );
}
