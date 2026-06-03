"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { InlineAnnouncements } from "@/components/marketing/public-announcements";
import { LogoIcon, MailIcon, HelpIcon } from "@/components/icons";
import { usePublicSiteSetting } from "@/lib/public-site-settings";

interface SidebarLink {
  name: string;
  href: string;
}

interface HelpArticleLayoutProps {
  title: string;
  breadcrumb: string;
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
  relatedLinks?: Array<{ label: string; href: string }>;
}

function Sidebar({ links, title }: { links: SidebarLink[]; title: string }) {
  return (
    <aside className="w-full lg:w-[280px] lg:border-r border-gray-200 p-8 lg:pt-12 bg-gray-100 lg:bg-transparent">
      <h2 className="text-[18px] font-semibold text-brand-dark-alt mb-4">
        {title}
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
  relatedLinks,
}: HelpArticleLayoutProps) {
  const ui = usePublicSiteSetting("help.ui", {
    sectionsTitle: "Sections",
    helpfulPrompt: "Was this article helpful?",
    helpfulYes: "Yes",
    helpfulNo: "No",
    moreQuestionsPrefix: "Have more questions?",
    moreQuestionsCta: "Submit a request",
    contactCardTitle: "Can&apos;t find what you need?",
    contactCardBody: "Contact us and we&apos;ll get back to you as soon as we can.",
    servicesCardTitle: "Ready to book a task?",
    servicesCardBody: "Head over to our website to see our available categories!",
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <InlineAnnouncements placement="support" />
      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto">
        <Sidebar links={sidebarLinks} title={ui.sectionsTitle} />
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
              {ui.helpfulPrompt}
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">
                {ui.helpfulYes}
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">
                {ui.helpfulNo}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {ui.moreQuestionsPrefix}{" "}
              <Link
                href="/contact"
                className="text-brand-terracotta hover:underline"
              >
                {ui.moreQuestionsCta}
              </Link>
            </p>
          </div>

          {/* CTA Cards */}
          {relatedLinks && relatedLinks.length > 0 ? (
            <div className="mb-12">
              <h3 className="mb-4 text-[20px] font-bold text-brand-dark-alt">Related articles</h3>
              <ul className="space-y-4">
                {relatedLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className="text-[15px] font-medium text-brand-terracotta hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/contact" className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-terracotta flex items-center justify-center mb-4">
                <MailIcon />
              </div>
              <h3 className="text-[20px] font-bold text-brand-dark-alt">
                {ui.contactCardTitle}
              </h3>
              <p className="text-base text-brand-dark-alt mt-2">
                {ui.contactCardBody}
              </p>
            </Link>
            <Link href="/services" className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px] hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <LogoIcon />
              </div>
              <h3 className="text-[20px] font-bold text-brand-dark-alt">
                {ui.servicesCardTitle}
              </h3>
              <p className="text-base text-brand-dark-alt mt-2">
                {ui.servicesCardBody}
              </p>
            </Link>
          </div>
        </main>
      </div>
      <Footer />
      <HelpButton />
    </div>
  );
}
