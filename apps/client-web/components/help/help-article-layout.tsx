"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { LogoIcon, MailIcon, HelpIcon } from "@/components/icons";

interface SidebarLink {
  name: string;
  href: string;
}

interface HelpArticleLayoutProps {
  title: string;
  breadcrumb: string;
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
}

function Sidebar({ links }: { links: SidebarLink[] }) {
  return (
    <aside className="w-full lg:w-[280px] lg:border-r border-gray-200 p-8 lg:pt-12 bg-gray-100 lg:bg-transparent">
      <h2 className="text-[18px] font-semibold text-brand-dark-alt mb-4">
        Sections
      </h2>
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-[15px] px-4 py-3 rounded-[4px] transition-colors text-brand-terracotta font-medium hover:bg-gray-200"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function HelpButton() {
  return (
    <button
      aria-label="Get help"
      className="fixed bottom-6 left-6 bg-brand-terracotta text-white p-4 rounded-full shadow-lg hover:bg-brand-terracotta/85 transition-colors flex items-center justify-center"
    >
      <HelpIcon />
    </button>
  );
}

export function HelpArticleLayout({
  title,
  breadcrumb,
  sidebarLinks,
  children,
}: HelpArticleLayoutProps) {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto">
        <Sidebar links={sidebarLinks} />
        <main className="flex-1 max-w-full lg:max-w-[800px] px-6 md:px-12 py-12">
          {/* Breadcrumbs */}
          <p className="text-sm text-gray-500 mb-6">{breadcrumb}</p>

          {/* Title */}
          <h1 className="text-[42px] font-bold text-brand-dark-alt leading-tight tracking-[-0.5px] mb-8">
            {title}
          </h1>

          {/* Article Content */}
          <div className="space-y-10 text-[15px] text-brand-dark-alt leading-[1.7]">
            {children}
          </div>

          {/* Feedback Section */}
          <div className="text-center my-12 border-t border-b border-gray-200 py-8">
            <p className="text-[16px] font-medium text-brand-dark-alt mb-4">
              Was this article helpful?
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">
                Yes
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">
                No
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Have more questions?{" "}
              <Link
                href="/contact"
                className="text-brand-terracotta hover:underline"
              >
                Submit a request
              </Link>
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="w-12 h-12 rounded-full bg-brand-terracotta flex items-center justify-center mb-4">
                <MailIcon />
              </div>
              <h3 className="text-[20px] font-bold text-brand-dark-alt">
                Can&apos;t find what you need?
              </h3>
              <p className="text-base text-brand-dark-alt mt-2">
                Contact us and we&apos;ll get back to you as soon as we can.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <LogoIcon />
              </div>
              <h3 className="text-[20px] font-bold text-brand-dark-alt">
                Ready to book a task?
              </h3>
              <p className="text-base text-brand-dark-alt mt-2">
                Head over to our website to see our available categories!
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <HelpButton />
    </div>
  );
}
