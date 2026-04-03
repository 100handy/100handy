"use client";

// Note: Type errors below are false positives from React 19 compatibility with lucide-react and next/link
// The code works correctly at runtime. This is a known issue that will be resolved in future library updates.
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

// TikTok icon (lucide doesn't include TikTok)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://www.tiktok.com/@100_handy", label: "TikTok", Icon: TikTokIcon },
  { href: "https://www.instagram.com/100_handy/", label: "Instagram", Icon: Instagram },
  { href: "https://www.facebook.com/100handy/", label: "Facebook", Icon: Facebook },
  { href: "https://www.youtube.com/@100_handy", label: "YouTube", Icon: Youtube },
  { href: "https://linkedin.com/company/100handy", label: "LinkedIn", Icon: Linkedin },
];

const discoverLinks = [
  { label: "Become a 100 Handy Pro", href: "/become-100-handy-pro" },
  { label: "All Services", href: "/all-services" },
  { label: "Services by City", href: "/services-by-city" },
  { label: "100 Handy Stars", href: "/100-handy-star" },
];

const serviceLinks = [
  { label: "Furniture Assembly", href: "/services" },
  { label: "TV & Wall Mounting", href: "/services" },
  { label: "Home Repairs", href: "/services" },
  { label: "Plumbing", href: "/services" },
  { label: "Electrical", href: "/services" },
  { label: "Cleaning", href: "/services" },
  { label: "Packing & Moving", href: "/services" },
  { label: "Outdoor Help", href: "/services" },
];

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Blog", href: "/blog" },
  { label: "Partner", href: "/partner" },
  { label: "HandyCare", href: "/handycare" },
  { label: "Help", href: "/help" },
];

const legalLinks = [
  { label: "Terms and Conditions", href: "/terms#terms-of-service" },
  { label: "Privacy Policy", href: "/terms#privacy-policy" },
  { label: "Cookie Settings", href: "/cookie-settings" },
  { label: "Legal Requirements", href: "/terms#platform-rules" },
];

export function Footer(): JSX.Element {
  return (
    <footer className="bg-brand-dark-alt py-12 text-gray-300">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo, Follow us, and Social - left side */}
          <div className="flex flex-col">
            <Link href="/" className="mb-4">
              <span className="text-[28px] font-bold text-white md:text-[32px]">
                100<span className="font-normal">HANDY</span>
              </span>
            </Link>
            <p className="mb-4 text-sm text-gray-400">Follow us we&apos;re friendly</p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">Discover</h3>
            <ul className="space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Download App */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div>
              <h3 className="mb-3 text-[14px] font-bold text-white">Download the app</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-10 items-center gap-2 rounded-lg bg-white/10 px-4 text-[13px] text-white transition-colors hover:bg-white/20"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  iOS App Store
                </a>
                <a
                  href="#"
                  className="flex h-10 items-center gap-2 rounded-lg bg-white/10 px-4 text-[13px] text-white transition-colors hover:bg-white/20"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.73c.44.07.9-.03 1.3-.29l.02-.01 13.86-8.01-3.48-3.48-11.7 11.79zm-.6-1.22l.04-.05L14.19 10.9 10.7 7.43 2.03 20.17c-.19.37-.2.79-.05 1.17l.6 1.17zm.4-21.08c-.35-.2-.76-.24-1.14-.13l11.54 11.55 3.4-3.39L3.16 1.49l-.17-.06zM21.78 10.96L18.58 9.1l-3.71 3.71 3.72 3.72 3.19-1.84c.59-.34.96-.96.96-1.64 0-.69-.37-1.31-.96-1.64v.55z" />
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
            <p className="text-[14px] text-gray-400">
              © {new Date().getFullYear()} 100Handy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
