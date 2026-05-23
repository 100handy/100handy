"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type LogoVariant = "dark" | "cream";
type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<LogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto sm:h-11",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
};

const fallbackVariantSrc: Record<LogoVariant, string> = {
  dark: "/logos/100handy-green.png",
  cream: "/logos/100handy-cream.png",
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

export function Logo({ variant = "dark", size = "md", className }: LogoProps) {
  const [src, setSrc] = useState(fallbackVariantSrc[variant]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase
      .from("site_settings")
      .select("value_json")
      .eq("setting_key", "brand.logos")
      .maybeSingle()
      .then(({ data }) => {
        const value = data?.value_json as Record<string, unknown> | undefined;
        const override = value?.[variant];
        if (typeof override === "string" && override.trim()) {
          setSrc(override);
        }
      });
  }, [variant]);

  return (
    <Image
      src={src}
      alt="100Handy"
      width={2084}
      height={834}
      className={className ?? sizeClasses[size]}
    />
  );
}
