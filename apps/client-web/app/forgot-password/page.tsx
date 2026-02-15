"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState } from "react";
import Image from "next/image";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@shared/schemas/auth";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      // Send OTP for password reset
      await authClient.resetPassword.sendOTP(data.email, {
        onSuccess: () => {
          // Redirect to verify-code page with reset parameter
          router.push(`/verify-code?email=${encodeURIComponent(data.email)}&reset=true`);
        },
        onError: (ctx) => {
          console.error("Password reset error:", ctx.error.message);
          toast.error(ctx.error.message || "Failed to send reset code");
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
              className="flex items-center gap-2 text-brand-dark-alt hover:text-brand-dark-alt/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-[15px] font-medium">Back to Sign In</span>
            </button>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] text-brand-dark-alt">
              <span className="font-light">100</span>
              <span className="font-bold">HANDY</span>
            </h1>
          </div>

          {/* Title & Description */}
              <div className="text-center mb-8">
                <h2 className="text-[24px] font-semibold text-brand-dark-alt mb-3">
                  Forgot your password?
                </h2>
                <p className="text-[15px] text-brand-dark-alt/80 leading-relaxed">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading || !isValid}
                    className={`w-full h-12 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                      !loading && isValid
                        ? "bg-brand-terracotta text-white border-brand-terracotta hover:bg-brand-terracotta/90"
                        : "bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-100"
                    }`}
                    variant="outline"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-brand-dark-alt">
              Remember your password?{" "}
              <Link
                href="/sign-in"
                className="text-brand-terracotta font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms Text */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-brand-dark-alt/70 leading-relaxed">
              Need help?{" "}
              <Link href="/help" className="text-brand-terracotta hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
