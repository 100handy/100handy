import Image from "next/image";

type LogoVariant = "dark" | "cream";
type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<LogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto sm:h-11",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
};

const variantSrc: Record<LogoVariant, string> = {
  dark: "/logos/100handy-green.png",
  cream: "/logos/100handy-cream.png",
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

export function Logo({ variant = "dark", size = "md", className }: LogoProps) {
  return (
    <Image
      src={variantSrc[variant]}
      alt="100Handy"
      width={2084}
      height={834}
      className={className ?? sizeClasses[size]}
    />
  );
}
