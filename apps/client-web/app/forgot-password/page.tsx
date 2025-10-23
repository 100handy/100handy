"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState } from "react";
import Image from "next/image";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Use Supabase auth through authClient wrapper
      await authClient.resetPassword.email(email, {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (ctx) => {
          console.error("Password reset error:", ctx.error.message);
          alert(ctx.error.message || "Failed to send reset email");
        },
      });
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/signup-bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Centered Form Card */}
      <div className="relative z-10 w-full max-w-[560px] px-4 py-8">
        <div className="bg-white rounded-[12px] shadow-2xl px-12 py-10">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#30352d] hover:text-[#30352d]/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-[15px] font-medium">Back to Sign In</span>
            </button>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] text-[#30352d]">
              <span className="font-light">100</span>
              <span className="font-bold">HANDY</span>
            </h1>
          </div>

          {!submitted ? (
            <>
              {/* Title & Description */}
              <div className="text-center mb-8">
                <h2 className="text-[24px] font-semibold text-[#30352d] mb-3">
                  Forgot your password?
                </h2>
                <p className="text-[15px] text-[#30352d]/80 leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none placeholder:text-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                      !loading && email
                        ? "bg-[#C1856A] text-white border-[#C1856A] hover:bg-[#C1856A]/90"
                        : "bg-[#f5f5f5] border border-gray-200 text-[#b7b7b7] hover:bg-gray-100"
                    }`}
                    variant="outline"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-[14px] text-[#30352d]">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="text-[#C1856A] font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center py-8">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-[#C1856A]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#C1856A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-[24px] font-semibold text-[#30352d] mb-3">
                  Check your email
                </h2>
                <p className="text-[15px] text-[#30352d]/80 leading-relaxed mb-8">
                  We've sent a password reset link to
                  <br />
                  <span className="font-semibold text-[#30352d]">{email}</span>
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/sign-in")}
                    className="w-full h-12 bg-[#C1856A] text-white border-[#C1856A] hover:bg-[#C1856A]/90 text-[18px] font-bold rounded-md shadow-sm"
                    variant="outline"
                  >
                    Back to Sign In
                  </Button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full text-[15px] text-[#C1856A] hover:underline py-2"
                  >
                    Didn't receive the email? Resend
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Terms Text */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#30352d]/70 leading-relaxed">
              Need help?{" "}
              <Link href="/help" className="text-[#C1856A] hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
