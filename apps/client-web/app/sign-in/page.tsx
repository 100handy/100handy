"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@shared/schemas/auth";
import { useClientPageContent } from "@/lib/client-page-content";

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const c = useClientPageContent("sign-in");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const authError = searchParams.get("error");
  const safeRedirect =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  useEffect(() => {
    if (authError) {
      toast.error(decodeURIComponent(authError));
    }
  }, [authError]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signInWithGoogle();
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await authClient.signInWithApple();
    } catch {
      toast.error("Apple sign-in failed. Please try again.");
    }
  };

  const onSubmit = async (data: SignInFormData) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx: { error: { message: string } }) => {
          console.error(ctx.error.message);
          toast.error(ctx.error.message || "Failed to sign in");
        },
        onSuccess: async () => {
          router.push(safeRedirect);
        },
      }
    );
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
        <div className="bg-white rounded-[12px] shadow-2xl px-12 py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <Logo size="lg" className="h-12 w-auto mx-auto" />
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
              >
                {c("hero.email_label", "Email Address")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={c("hero.email_placeholder", "Email Address")}
                {...register("email")}
                className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
              >
                {c("hero.password_label", "Password")}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={c("hero.password_placeholder", "Password")}
                {...register("password")}
                className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none placeholder:text-gray-400"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-[15px] text-brand-terracotta hover:underline"
              >
                {c("hero.forgot_password_text", "Forgot password?")}
              </Link>
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
                  c("hero.submit_text", "Log in")
                )}
              </Button>
            </div>
          </form>

          {/* OAuth divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">{c("hero.oauth_divider_text", "Or continue with")}</span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <img src="/images/google-logo.svg" alt="" className="mr-2 h-4 w-4" />
              {c("hero.google_text", "Google")}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleAppleSignIn}
              className="h-11 border-gray-200 hover:bg-gray-50"
            >
              <img src="/images/apple-logo.svg" alt="" className="mr-2 h-4 w-4" />
              {c("hero.apple_text", "Apple")}
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-[14px] text-brand-dark-alt">
              {c("hero.signup_prompt", "Don't have an account?")}{" "}
              <Link
                href="/sign-up"
                className="text-brand-terracotta font-semibold hover:underline"
              >
                {c("hero.signup_link_text", "Sign Up")}
              </Link>
            </p>
          </div>

          {/* Terms Text */}
          <div className="mt-4 text-center">
            <p className="text-[13px] text-brand-dark-alt leading-relaxed">
              {c("hero.terms_text", "I agree to the")}{" "}
              <Link href="/terms" className="text-brand-terracotta hover:underline">
                Terms of Service
              </Link>{" "}
              and have reviewed the{" "}
              <Link href="/terms" className="text-brand-terracotta hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-200" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-terracotta animate-spin" />
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
