"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useClientPageContent } from "@/lib/client-page-content";

export default function WelcomePage() {
  const c = useClientPageContent("welcome");

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${c("hero.background_image", "/assets/welcome.png")}')`,
        }}
      >
        {/* Overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Welcome Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" className="h-12 w-auto mx-auto" />
        </div>

        {/* Welcome Text */}
        <p className="text-center text-brand-dark font-semibold text-lg sm:text-xl mb-8">
          {c("hero.welcome_text", "Welcome to 100 Handy")}
        </p>

        {/* Sign Up Button */}
        <Button
          asChild
          className="w-full bg-brand-terracotta hover:bg-brand-coral text-white font-bold text-lg py-6 rounded-full mb-4"
        >
          <Link href="/sign-up">{c("hero.sign_up_text", "Sign up")}</Link>
        </Button>

        {/* Log In Button */}
        <Button
          asChild
          variant="outline"
          className="w-full border-2 border-brand-terracotta text-brand-terracotta hover:bg-brand-terracotta hover:text-white font-bold text-lg py-6 rounded-full mb-6"
        >
          <Link href="/sign-in">{c("hero.log_in_text", "Log in")}</Link>
        </Button>

        {/* Terms and Privacy */}
        <div className="text-center text-sm text-brand-dark space-y-1">
          <p>
            {c("hero.terms_prefix", "By signing up, you agree to the")}{" "}
            <Link href="/terms" className="text-brand-terracotta hover:underline">
              Terms of Service
            </Link>
          </p>
          <p>
            {c("hero.privacy_prefix", "and have reviewed the")}{" "}
            <Link href="/terms" className="text-brand-terracotta hover:underline">
              Privacy Policy.
            </Link>
          </p>
          <p>
            {c("hero.cookie_prefix", "Manage")}{" "}
            <Link href="/cookie-settings" className="text-brand-terracotta hover:underline">
              privacy settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
