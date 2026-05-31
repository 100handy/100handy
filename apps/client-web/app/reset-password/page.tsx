"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@100handy/ui/components/input";
import { useState, Suspense } from "react";
import Image from "next/image";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@shared/schemas/auth";
import { useClientPageContent } from "@/lib/client-page-content";

function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const c = useClientPageContent("reset-password");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      // Use Supabase auth to update password
      await authClient.updatePassword(data.password, {
        onSuccess: () => {
          setSuccess(true);
          toast.success("Password reset successful!");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to reset password");
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const bgImage = c("hero.background_image", "/images/signup-bg.jpg");

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
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
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="lg" className="h-12 w-auto mx-auto" />
          </div>

          {!success ? (
            <>
              {/* Title & Description */}
              <div className="text-center mb-8">
                <h2 className="text-[24px] font-semibold text-brand-dark-alt mb-3">
                  {c("hero.title", "Reset your password")}
                </h2>
                <p className="text-[15px] text-brand-dark-alt/80 leading-relaxed">
                  {c("hero.description", "Enter your new password below.")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                  >
                    {c("hero.password_label", "New Password")}
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder={c("hero.password_placeholder", "Enter new password")}
                      {...register("password")}
                      className="w-full h-12 border border-gray-300 rounded-md px-4 pr-12 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-dark-alt"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                  >
                    {c("hero.confirm_password_label", "Confirm Password")}
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={c("hero.confirm_password_placeholder", "Confirm new password")}
                      {...register("confirmPassword")}
                      className="w-full h-12 border border-gray-300 rounded-md px-4 pr-12 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-dark-alt"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-[13px] text-brand-dark-alt/70 leading-relaxed">
                    {c("hero.password_requirements", "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers")}
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    variant="terracotta"
                    size="full"
                    type="submit"
                    disabled={loading || !isValid}
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      c("hero.submit_text", "Reset Password")
                    )}
                  </Button>
                </div>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-[14px] text-brand-dark-alt">
                  {c("hero.sign_in_prompt", "Remember your password?")}{" "}
                  <Link
                    href="/sign-in"
                    className="text-brand-terracotta font-semibold hover:underline"
                  >
                    {c("hero.sign_in_link_text", "Sign In")}
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
                  <div className="w-16 h-16 bg-brand-terracotta/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-brand-terracotta"
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

                <h2 className="text-[24px] font-semibold text-brand-dark-alt mb-3">
                  {c("hero.success_title", "Password reset successful!")}
                </h2>
                <p className="text-[15px] text-brand-dark-alt/80 leading-relaxed mb-8">
                  {c("hero.success_description", "Your password has been successfully reset. You can now sign in with your new password.")}
                </p>

                {/* Action Button */}
                <Button
                  variant="terracotta"
                  size="full"
                  onClick={() => router.push("/sign-in")}
                >
                  {c("hero.success_cta_text", "Go to Sign In")}
                </Button>
              </div>
            </>
          )}

          {/* Terms Text */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-brand-dark-alt/70 leading-relaxed">
              {c("hero.help_text", "Need help?")}{" "}
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

export default function ResetPassword() {
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
      <ResetPasswordForm />
    </Suspense>
  );
}
