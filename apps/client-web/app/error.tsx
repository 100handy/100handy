"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[40px] text-brand-dark-alt mb-6">
          <span className="font-light">100</span>
          <span className="font-bold">HANDY</span>
        </h1>
        <h2 className="text-2xl font-semibold text-brand-dark-alt mb-3">
          Something went wrong
        </h2>
        <p className="text-brand-dark-alt/70 mb-8">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-brand-terracotta text-white font-semibold rounded-md hover:bg-brand-terracotta/85 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-brand-dark-alt font-semibold rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
