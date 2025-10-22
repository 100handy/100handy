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

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    await authClient.signUp.email(
      {
        email,
        password,
        name: `${firstName} ${lastName}`,
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
          alert(ctx.error.message || "Failed to create account");
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
            <div className="text-center mb-6">
              <h1 className="text-[40px] text-[#30352d]">
                <span className="font-light">100</span>
                <span className="font-bold">HANDY</span>
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                  />
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
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                  />
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                />
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                />
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
                  <Image
                    src="/images/uk-flag.png"
                    alt="UK"
                    width={28}
                    height={17}
                    className="flex-shrink-0"
                  />
                  <span className="text-[15px] font-bold text-[#30352d]">+ 44</span>
                  <ChevronDown className="w-4 h-4 text-[#30352d]" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 border-0 rounded-none px-0 focus-visible:ring-0 shadow-none h-auto py-0"
                  />
                </div>
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
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  className="w-full border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none"
                />
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
                  disabled={loading || !agreedToTerms}
                  className={`w-full h-11 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                    !loading && agreedToTerms && firstName && lastName && email && password
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
