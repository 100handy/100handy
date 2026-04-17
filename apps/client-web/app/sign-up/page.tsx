"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { Checkbox } from "@100handy/ui/components/checkbox";
import { useState, Suspense } from "react";
import Image from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@shared/schemas/auth";

const countryCodes = [
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+1", name: "US/Canada", flag: "🇺🇸" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "+216", name: "Tunisia", flag: "🇹🇳" },
  { code: "+249", name: "Sudan", flag: "🇸🇩" },
  { code: "+243", name: "DR Congo", flag: "🇨🇩" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+98", name: "Iran", flag: "🇮🇷" },
  { code: "+964", name: "Iraq", flag: "🇮🇶" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
];

function SignUpForm() {
  const [countryCode, setCountryCode] = useState("+44");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const safeRedirect =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      postcode: "",
    },
  });

  const email = watch("email");

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

  const onSubmit = async (formData: SignUpFormData) => {
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    await authClient.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: `${countryCode}${formData.phone}`,
        postcode: formData.postcode,
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
          toast.error(ctx.error.message || "Failed to create account");
        },
        onSuccess: async () => {
          // Redirect to verify-code page with email parameter
          router.push(
            `/verify-code?email=${encodeURIComponent(formData.email)}&redirect=${encodeURIComponent(safeRedirect)}`
          );
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
            <div className="text-center mb-6">
              <Link href="/">
                <Logo size="lg" className="h-12 w-auto mx-auto" />
              </Link>
            </div>

            {/* OAuth buttons */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                className="h-11 border-gray-200 hover:bg-gray-50"
              >
                <img src="/images/google-logo.svg" alt="" className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleAppleSignIn}
                className="h-11 border-gray-200 hover:bg-gray-50"
              >
                <img src="/images/apple-logo.svg" alt="" className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>

            {/* OAuth / email divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400">Or sign up with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                  >
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    type="text"
                    {...register("firstName")}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                  >
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    type="text"
                    {...register("lastName")}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none"
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
                  {...register("password")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                >
                  Phone Number
                </label>
                <div className="flex items-center gap-2 border-0 border-b border-gray-300 pb-1">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[110px] border-0 shadow-none focus:ring-0 h-auto p-0">
                      <SelectValue>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">
                            {countryCodes.find(c => c.code === countryCode)?.flag ?? "🏳️"}
                          </span>
                          <span className="text-[15px] font-bold text-brand-dark-alt">{countryCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.code} ({country.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="flex-1 border-0 rounded-none px-0 focus-visible:ring-0 shadow-none h-auto py-0"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Post Code */}
              <div>
                <label
                  htmlFor="postcode"
                  className="block text-[15px] font-medium text-brand-dark-alt mb-1.5"
                >
                  Post code
                </label>
                <Input
                  id="postcode"
                  type="text"
                  {...register("postcode")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-brand-dark-alt shadow-none"
                />
                {errors.postcode && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.postcode.message}
                  </p>
                )}
              </div>

              {/* Help Text */}
              <p className="text-[12px] font-medium text-brand-dark-alt leading-relaxed">
                Your phone and postcode help us match and <br />
                connect you with the right 100 Handy Pros.
              </p>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  className="mt-0.5 data-[state=checked]:bg-brand-terracotta data-[state=checked]:border-brand-terracotta"
                />
                <label
                  htmlFor="terms"
                  className="text-[15px] font-light text-brand-dark-alt leading-relaxed cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-black"
                  >
                    Terms of Service
                  </Link>{" "}
                  and have reviewed the{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* GDPR Marketing Opt-out */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketing-optout"
                  className="mt-0.5 data-[state=checked]:bg-brand-terracotta data-[state=checked]:border-brand-terracotta"
                />
                <label
                  htmlFor="marketing-optout"
                  className="text-[15px] font-light text-brand-dark-alt leading-relaxed cursor-pointer select-none"
                >
                  I do not want to receive promotional emails and notifications from 100Handy
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={loading || !agreedToTerms || !isValid}
                  className={`w-full h-11 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                    !loading && agreedToTerms && isValid
                      ? "bg-brand-terracotta text-white border-brand-terracotta hover:bg-brand-terracotta/90"
                      : "bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-100"
                  }`}
                  variant="outline"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>

          {/* Sign In Link */}
          <div className="mt-3 text-center pb-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={`/sign-in?redirect=${encodeURIComponent(safeRedirect)}`}
                className="text-brand-dark-alt font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-200" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-terracotta animate-spin" />
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
