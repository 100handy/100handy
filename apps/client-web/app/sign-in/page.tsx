"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@shared/schemas/auth";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          router.push("/dashboard");
        },
      }
    );
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
        <div className="bg-white rounded-[12px] shadow-2xl px-12 py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] text-brand-dark-alt">
              <span className="font-light">100</span>
              <span className="font-bold">HANDY</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="Email Address"
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
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
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
                Forgot password?
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
                  "Log in"
                )}
              </Button>
            </div>
          </form>

          {/* Terms Text */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-brand-dark-alt leading-relaxed">
              By logging in, you agree to the{" "}
              <Link href="/terms" className="text-brand-terracotta hover:underline">
                Terms of Service
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
