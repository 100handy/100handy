"use client";

// Note: Type errors below are false positives from React 19 compatibility with lucide-react and next/link
// The code works correctly at runtime. This is a known issue that will be resolved in future library updates.
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

const discoverLinks = [
  { label: "Become a Handy", href: "/become-tasker" },
  { label: "Services By City", href: "/services-by-city" },
  { label: "All Services", href: "/all-services" },
  { label: "Elite Handies", href: "/elite-taskers" },
  { label: "Help", href: "/help" },
];

const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Careers", href: "/careers" },
  { label: "Partner with 100 Handy", href: "/partner" },
  { label: "Press", href: "/press" },
  { label: "100 Handy for Good", href: "/for-good" },
  { label: "Blog", href: "/blog" },
  { label: "Terms & Privacy", href: "/terms" },
  { label: "Legal", href: "/legal" },
  { label: "Cookie Settings", href: "/cookie-settings" },
];

export function Footer(): JSX.Element {
  return (
    <footer className="bg-brand-dark-alt py-12 text-gray-300">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mb-6 text-sm text-gray-400">
          Follow us! We're friendly:
        </div>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Social */}
          <div>
            <div className="mb-6 text-[16px] font-bold text-white">
              100<span className="font-normal">HANDY</span>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
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


          {/* Download App */}
          <div>
            <h3 className="mb-4 text-[14px] font-bold text-white">
              Download our app
            </h3>
            <p className="mb-4 text-[14px] leading-relaxed text-gray-300">
              Tackle your to-do list wherever you are with our mobile app.
            </p>
            <div className="space-y-3">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 transition-colors hover:bg-black/80"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">
                    Download on the
                  </div>
                  <div className="text-[14px] font-semibold text-white">
                    App Store
                  </div>
                </div>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 transition-colors hover:bg-black/80"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">GET IT ON</div>
                  <div className="text-[14px] font-semibold text-white">
                    Google Play
                  </div>
                </div>
              </a>
            </div>
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
