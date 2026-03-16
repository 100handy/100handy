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

const companyLinks = [
  { label: "About us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Blog", href: "/blog" },
  { label: "Partner", href: "/partner" },
  { label: "HandyCare", href: "/handycare" },
  { label: "Help", href: "/help" },
];

const legalLinks = [
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/terms" },
  { label: "Cookie Settings", href: "/cookie-settings" },
  { label: "Legal Requirements", href: "/legal" },
];

export function Footer(): JSX.Element {
  return (
    <footer className="bg-brand-dark-alt py-12 text-gray-300">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-[14px] text-gray-400">
            © {new Date().getFullYear()} 100Handy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
