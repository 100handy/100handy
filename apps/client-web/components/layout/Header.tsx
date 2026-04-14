"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  currentPage?: "get-e10" | "book-task" | "my-tasks" | "account";
}

export default function Header({ currentPage }: HeaderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const signedInLinks = [
    { href: "/referral", label: "Get £10", page: "get-e10" as const },
    { href: "/dashboard", label: "Book a Task", page: "book-task" as const },
    { href: "/my-tasks", label: "My Tasks", page: "my-tasks" as const },
    { href: "/account", label: "Account", page: "account" as const },
  ];

  const signedOutLinks = [
    { href: "/services", label: "Services" },
    { href: "/sign-in", label: "Sign up / Log in" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          {isSignedIn ? (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {signedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium hover:text-brand-terracotta transition-colors text-base ${
                    currentPage === link.page ? "text-brand-terracotta" : "text-brand-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {signedOutLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium hover:text-brand-terracotta transition-colors text-base text-brand-dark"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/become-100-handy-pro"
                className="px-4 py-2 rounded-full bg-brand-terracotta text-white font-medium text-base hover:bg-brand-terracotta/90 transition-colors"
              >
                Become a Pro
              </Link>
            </nav>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-brand-dark-alt"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {isSignedIn ? (
              signedInLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`font-medium py-3 transition-colors ${
                    currentPage === link.page ? "text-brand-terracotta" : "text-brand-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                {signedOutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="font-medium text-brand-dark py-3 transition-colors hover:text-brand-terracotta"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/become-100-handy-pro"
                  onClick={closeMobile}
                  className="mt-2 px-4 py-3 rounded-full bg-brand-terracotta text-white font-medium text-center hover:bg-brand-terracotta/90 transition-colors"
                >
                  Become a Pro
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
