"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[70px] max-w-[1920px] items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-[16px] font-bold text-gray-900">
            100<span className="font-normal">HANDY</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/services"
            className="text-[16px] font-medium text-brand-dark-alt transition-colors hover:text-brand-terracotta"
          >
            Services
          </Link>
          <Link
            href="/sign-in"
            className="text-[16px] font-medium text-brand-dark-alt transition-colors hover:text-brand-terracotta"
          >
            Sign up / Log in
          </Link>
          <Link
            href="/become-100-handy-pro"
            className="px-4 py-2 rounded-md bg-brand-terracotta text-white font-medium text-[16px] hover:bg-brand-terracotta/90 transition-colors"
          >
            Become a Pro
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-brand-dark-alt"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="text-[16px] font-medium text-brand-dark-alt py-2 transition-colors hover:text-brand-terracotta"
            >
              Services
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="text-[16px] font-medium text-brand-dark-alt py-2 transition-colors hover:text-brand-terracotta"
            >
              Sign up / Log in
            </Link>
            <Link
              href="/become-100-handy-pro"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-md bg-brand-terracotta text-white font-medium text-[16px] text-center hover:bg-brand-terracotta/90 transition-colors"
            >
              Become a Pro
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
