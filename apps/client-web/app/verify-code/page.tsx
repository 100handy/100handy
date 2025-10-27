"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState, Suspense } from "react";
import Image from "next/image";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function VerifyCodeForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "+44 7784 - 500446";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      await authClient.verifyOTP(phoneNumber, code, {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          console.error("OTP verification error:", ctx.error.message);
          alert(ctx.error.message || "Failed to verify code");
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await authClient.resendOTP(phoneNumber, {
        onSuccess: () => {
          alert("Verification code resent!");
        },
        onError: (ctx) => {
          console.error("Resend OTP error:", ctx.error.message);
          alert(ctx.error.message || "Failed to resend code");
        },
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
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
          {/* Back Button & Title */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#30352d] hover:text-[#30352d]/80 mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[24px] font-semibold text-[#30352d]">
              Verify your authentication code
            </h1>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-[15px] text-[#30352d] leading-relaxed">
              Enter the 6-digit code sent to your phone number
            </p>
            <p className="text-[15px] font-semibold text-[#30352d] mt-1">
              {phoneNumber}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Code Input */}
            <div className="flex justify-center">
              <Input
                id="code"
                type="text"
                placeholder="Enter Code"
                required
                maxLength={6}
                value={code}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  setCode(value);
                }}
                className="w-full max-w-[320px] h-12 border border-gray-300 rounded-md px-4 text-center text-[16px] focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none placeholder:text-gray-400"
              />
            </div>

            {/* Resend Code Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[15px] text-[#C1856A] hover:underline"
              >
                Resend code
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className={`w-full h-12 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                  !loading && code.length === 6
                    ? "bg-[#C1856A] text-white border-[#C1856A] hover:bg-[#C1856A]/90"
                    : "bg-[#f5f5f5] border border-gray-200 text-[#b7b7b7] hover:bg-gray-100"
                }`}
                variant="outline"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </form>

          {/* Terms Text */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#30352d] leading-relaxed">
              By singing up, you agree to the{" "}
              <Link href="/terms" className="text-[#C1856A] hover:underline">
                Term of service
              </Link>
              <br />
              and have reviewed the{" "}
              <Link href="/privacy" className="text-[#C1856A] hover:underline">
                Privacy Policy
              </Link>
              .
              <br />
              Manage{" "}
              <Link href="/privacy-settings" className="text-[#C1856A] hover:underline">
                privacy settings
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCode() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/signup-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    }>
      <VerifyCodeForm />
    </Suspense>
  );
}
