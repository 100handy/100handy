"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/welcome.png')",
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Welcome Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-brand-dark-alt font-bold text-4xl sm:text-5xl font-display">
            100<span className="font-normal">HANDY</span>
          </h1>
        </div>

        {/* Welcome Text */}
        <p className="text-center text-brand-dark font-semibold text-lg sm:text-xl mb-8">
          Wellcome to 100 Handy
        </p>

        {/* Sign Up Button */}
        <Button
          asChild
          className="w-full bg-brand-terracotta hover:bg-brand-coral text-white font-bold text-lg py-6 rounded-full mb-4"
        >
          <Link href="/sign-up">Sign up</Link>
        </Button>

        {/* Log In Button */}
        <Button
          asChild
          variant="outline"
          className="w-full border-2 border-brand-terracotta text-brand-terracotta hover:bg-brand-terracotta hover:text-white font-bold text-lg py-6 rounded-full mb-6"
        >
          <Link href="/login">Log in</Link>
        </Button>

        {/* Terms and Privacy */}
        <div className="text-center text-sm text-brand-dark space-y-1">
          <p>
            By singing up, you agree to the{" "}
            <Link href="/terms" className="text-brand-terracotta hover:underline">
              Term of service
            </Link>
          </p>
          <p>
            and have reviewed the{" "}
            <Link href="/privacy" className="text-brand-terracotta hover:underline">
              Privacy Policy.
            </Link>
          </p>
          <p>
            Manage{" "}
            <Link href="/privacy-settings" className="text-brand-terracotta hover:underline">
              privacy settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
