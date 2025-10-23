"use client";

import { Button } from "@100handy/ui/components/button";
import { Input } from "@100handy/ui/components/input";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signIn.email(
      {
        email,
        password,
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
          alert(ctx.error.message || "Failed to sign in");
        },
        onSuccess: async () => {
          router.push("/");
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
            <h1 className="text-[40px] text-[#30352d]">
              <span className="font-light">100</span>
              <span className="font-bold">HANDY</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none placeholder:text-gray-400"
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
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-md px-4 focus-visible:ring-0 focus-visible:border-[#30352d] shadow-none placeholder:text-gray-400"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-[15px] text-[#C1856A] hover:underline"
              >
                Forget password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-12 text-[18px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-md shadow-sm ${
                  !loading && email && password
                    ? "bg-[#C1856A] text-white border-[#C1856A] hover:bg-[#C1856A]/90"
                    : "bg-[#f5f5f5] border border-gray-200 text-[#b7b7b7] hover:bg-gray-100"
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
            <p className="text-[13px] text-[#30352d] leading-relaxed">
              By log in, you agree to the{" "}
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
