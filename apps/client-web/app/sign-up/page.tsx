"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { Checkbox } from "@100handy/ui/components/checkbox";
import { useState } from "react";
import Image from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
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

export default function SignUp() {
  const [countryCode, setCountryCode] = useState("+44");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
          router.push(`/verify-code?email=${encodeURIComponent(formData.email)}`);
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
              <h1 className="text-[40px] text-[#30352d]">
                <span className="font-light">100</span>
                <span className="font-bold">HANDY</span>
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name and Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                  >
                    First Name
                  </label>
                  <Input
                    id="first-name"
                    type="text"
                    {...register("firstName")}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
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
                    className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                  >
                    Last Name
                  </label>
                  <Input
                    id="last-name"
                    type="text"
                    {...register("lastName")}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
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
                  className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
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
                  className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
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
                  className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                >
                  Phone Number
                </label>
                <div className="flex items-center gap-2 border-0 border-b border-gray-300 pb-1">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[100px] border-0 shadow-none focus:ring-0 h-auto p-0">
                      <SelectValue>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{countryCode === "+44" ? "🇬🇧" : "🇮🇳"}</span>
                          <span className="text-[15px] font-bold text-[#30352d]">{countryCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+44">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇬🇧</span>
                          <span>+44 (UK)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="+91">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          <span>+91 (India)</span>
                        </div>
                      </SelectItem>
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
                  className="block text-[15px] font-medium text-[#30352d] mb-1.5"
                >
                  Post code
                </label>
                <Input
                  id="postcode"
                  type="text"
                  {...register("postcode")}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                />
                {errors.postcode && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.postcode.message}
                  </p>
                )}
              </div>

              {/* Help Text */}
              <p className="text-[12px] font-medium text-[#30352d] leading-relaxed">
                Your phone and postcode help us match and <br />
                Connect you with right Taskers.
              </p>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  className="mt-0.5 data-[state=checked]:bg-[#C17B6B] data-[state=checked]:border-[#C17B6B]"
                />
                <label
                  htmlFor="terms"
                  className="text-[15px] font-light text-[#30352d] leading-relaxed cursor-pointer select-none"
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
                    href="/privacy"
                    className="underline hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={loading || !agreedToTerms || !isValid}
                  className={`w-full h-11 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                    !loading && agreedToTerms && isValid
                      ? "bg-[#C1856A] text-white border-[#C1856A] hover:bg-[#C1856A]/90"
                      : "bg-[#f5f5f5] border border-gray-200 text-[#b7b7b7] hover:bg-gray-100"
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
                href="/sign-in"
                className="text-[#30352d] font-semibold hover:underline"
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
