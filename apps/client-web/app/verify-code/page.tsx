"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState, Suspense } from "react";
import Image from "next/image";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function VerifyCodeForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const phoneNumber = searchParams.get("phone") || "+44 7784 - 500446";
  const isPasswordReset = searchParams.get("reset") === "true";

  // Determine if we're verifying email or phone
  const isEmailVerification = !!email;
  const verificationTarget = email || phoneNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isPasswordReset && email) {
        // Verify password reset OTP
        await authClient.verifyPasswordResetOTP(email, code, {
          onSuccess: () => {
            toast.success("Code verified! Now set your new password.");
            router.push("/reset-password");
          },
          onError: (ctx) => {
            console.error("Password reset OTP verification error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to verify code");
          },
        });
      } else if (isEmailVerification) {
        // Verify email OTP (for signup)
        await authClient.verifyEmailOTP(email!, code, {
          onSuccess: () => {
            toast.success("Email verified successfully!");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            console.error("Email OTP verification error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to verify code");
          },
        });
      } else {
        // Verify phone OTP
        await authClient.verifyOTP(phoneNumber, code, {
          onSuccess: () => {
            toast.success("Phone verified successfully!");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            console.error("Phone OTP verification error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to verify code");
          },
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (isPasswordReset && email) {
        // Resend password reset OTP
        await authClient.resetPassword.sendOTP(email, {
          onSuccess: () => {
            toast.success("Password reset code resent to your email!");
          },
          onError: (ctx) => {
            console.error("Resend password reset OTP error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to resend code");
          },
        });
      } else if (isEmailVerification) {
        // Resend email OTP (for signup)
        await authClient.resendEmailOTP(email!, {
          onSuccess: () => {
            toast.success("Verification code resent to your email!");
          },
          onError: (ctx) => {
            console.error("Resend email OTP error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to resend code");
          },
        });
      } else {
        // Resend phone OTP
        await authClient.resendOTP(phoneNumber, {
          onSuccess: () => {
            toast.success("Verification code resent to your phone!");
          },
          onError: (ctx) => {
            console.error("Resend phone OTP error:", ctx.error.message);
            toast.error(ctx.error.message || "Failed to resend code");
          },
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("An unexpected error occurred");
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
              className="flex items-center gap-2 text-brand-dark-alt hover:text-brand-dark-alt/80 mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[24px] font-semibold text-brand-dark-alt">
              {isPasswordReset
                ? "Reset your password"
                : "Verify your authentication code"}
            </h1>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-[15px] text-brand-dark-alt leading-relaxed">
              {isPasswordReset
                ? "Enter the 6-digit code sent to your email to reset your password"
                : isEmailVerification
                ? "Enter the 6-digit code sent to your email"
                : "Enter the 6-digit code sent to your phone number"}
            </p>
            <p className="text-[15px] font-semibold text-brand-dark-alt mt-1">
              {verificationTarget}
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
                className="w-full max-w-[320px] h-12 border border-gray-300 rounded-md px-4 text-center text-[16px] focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
              />
            </div>

            {/* Resend Code Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[15px] text-brand-terracotta hover:underline"
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
                    ? "bg-brand-terracotta text-white border-brand-terracotta hover:bg-brand-terracotta/90"
                    : "bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-100"
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
            <p className="text-[13px] text-brand-dark-alt leading-relaxed">
              By signing up, you agree to the{" "}
              <Link href="/terms" className="text-brand-terracotta hover:underline">
                Term of service
              </Link>
              <br />
              and have reviewed the{" "}
              <Link href="/terms" className="text-brand-terracotta hover:underline">
                Privacy Policy
              </Link>
              .
              <br />
              Manage{" "}
              <Link href="/cookie-settings" className="text-brand-terracotta hover:underline">
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
