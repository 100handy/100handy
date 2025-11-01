"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface HeaderProps {
  currentPage?: "get-e10" | "book-task" | "my-tasks" | "account";
}

export default function Header({ currentPage }: HeaderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);

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

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[70px]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
              100<span className="font-normal">HANDY</span>
            </span>
          </Link>

          {isSignedIn ? (
            // Signed-in navigation (from Figma)
            <nav className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/get-e10"
                className={`font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                  currentPage === "get-e10" ? "text-brand-terracotta" : "text-brand-dark"
                }`}
              >
                Get £10
              </Link>
              <Link
                href="/dashboard"
                className={`font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                  currentPage === "book-task" ? "text-brand-terracotta" : "text-brand-dark"
                }`}
              >
                Book a Task
              </Link>
              <Link
                href="/my-tasks"
                className={`font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                  currentPage === "my-tasks" ? "text-brand-terracotta" : "text-brand-dark"
                }`}
              >
                My Tasks
              </Link>
              <Link
                href="/account"
                className={`font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base ${
                  currentPage === "account" ? "text-brand-terracotta" : "text-brand-dark"
                }`}
              >
                Account
              </Link>
            </nav>
          ) : (
            // Signed-out navigation (from Figma)
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/services"
                className="font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base text-brand-dark"
              >
                Services
              </Link>
              <Link
                href="/sign-in"
                className="font-medium hover:text-brand-terracotta transition-colors text-sm sm:text-base text-brand-dark"
              >
                Sign up / Log in
              </Link>
              <Link
                href="/become-tasker"
                className="px-4 py-2 rounded-md bg-brand-terracotta text-white font-medium text-sm sm:text-base hover:bg-brand-terracotta/90 transition-colors"
              >
                Become a Tasker
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
