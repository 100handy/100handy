"use client";
import React from 'react';
import Link from "next/link";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { LogoIcon, MailIcon, HelpIcon } from "@/components/icons";



const Sidebar = () => {
    const links = [
        { name: "Overview of trust and safety", href: "/help/trust-safety", active: true },
        { name: "What kind of insurance does 100Handy offer?", href: "/help/trust-safety#insurance", active: false },
        { name: "Limitations of insurance", href: "/help/trust-safety#limitations", active: false },
        { name: "Safety guidelines", href: "/help/trust-safety#safety", active: false },
    ];
    return (
        <aside className="w-full lg:w-[280px] lg:border-r border-gray-200 p-8 lg:pt-12 bg-gray-100 lg:bg-transparent">
            <h2 className="text-[18px] font-semibold text-brand-dark-alt mb-4">Article in this section</h2>
            <nav className="flex flex-col space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`text-[15px] px-4 py-3 rounded-[4px] transition-colors ${
                            link.active
                                ? 'bg-brand-terracotta text-white font-bold'
                                : 'text-brand-terracotta font-medium hover:bg-gray-200'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

const MainContent = () => {
    return (
        <main className="flex-1 max-w-full lg:max-w-[800px] px-6 md:px-12 py-12">
            {/* Breadcrumbs */}
            <p className="text-sm text-gray-500 mb-6">
                100Handy Support / policy center / trust and safety / policy basics
            </p>

            {/* Title */}
            <h1 className="text-[42px] font-bold text-brand-dark-alt leading-tight tracking-[-0.5px] mb-8">
                Overview of Trust and Safety
            </h1>

            {/* Article Content */}
            <div className="space-y-8 text-[15px] text-brand-dark-alt leading-[1.7]">
                <p>
                    100Handy is committed to creating fantastic and safe experiences.
                </p>

                <div className="space-y-3">
                    <h3 className="text-[16px] font-bold">Security of Personal Information</h3>
                    <p>
                        We take the security of all user information extremely seriously, and any sensitive information provided is kept secure and encrypted as a best practice. All financial information is handled carefully in accordance with our Privacy Policy.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <h3 className="text-[16px] font-bold">Background Checks</h3>
                    <p>
                         All 100Handy professionals undergo an extensive screening process before they can join our community. This includes a comprehensive identity and criminal background check, which reports information from national, local, and sex offender databases.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[16px] font-bold">100Handy Happiness Pledge</h3>
                    <p>
                        For every booking and every task, we offer the 100Handy Happiness Pledge. Please note that the Happiness Pledge is secondary to any insurance policies you already have in place (including medical, renter's, homeowner's, or other) and will apply for qualifying property damage or bodily injury claims within 30 days of the task giving rise to the claim. For more information, please visit the Happiness Pledge page.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-[16px] font-bold">Dispute Resolution Process</h3>
                    <p>
                       To report a tasker, any damages, injuries, or invoice disputes, our Customer Support team is available via live chat, phone, or email. If you have any relevant documentation, such as pictures or receipts, we ask that you please submit them as they will be required to complete your claim.
                    </p>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="text-center my-12 border-t border-b border-gray-200 py-8">
                <p className="text-[16px] font-medium text-brand-dark-alt mb-4">Was this article helpful?</p>
                <div className="flex justify-center space-x-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">Yes</button>
                    <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-brand-dark-alt text-base font-medium hover:bg-gray-100 hover:border-brand-terracotta transition-colors">No</button>
                </div>
                <p className="text-sm text-gray-500 mt-4">1200 out of 2120 found this helpful</p>
                <p className="text-sm text-gray-500 mt-2">Have more questions? <Link href="/contact" className="text-brand-terracotta hover:underline">Submit a request</Link></p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h4 className="text-[16px] font-bold mb-1">Previous article</h4>
                    <Link href="/help/trust-safety#elite-status" className="text-[15px] font-medium text-brand-terracotta hover:underline">What are the Perks of Elite Status?</Link>
                </div>
                <div className="text-right">
                    <h4 className="text-[16px] font-bold mb-1">Next article</h4>
                    <Link href="/help/trust-safety#insurance" className="text-[15px] font-medium text-brand-terracotta hover:underline">What Kind of Insurance Does 100Handy Offer?</Link>
                </div>
            </div>

            {/* Related Articles */}
            <div className="mb-12">
                <h3 className="text-[20px] font-bold text-brand-dark-alt mb-4">Related articles</h3>
                <ul className="space-y-4">
                    <li><Link href="/help/trust-safety#insurance" className="text-[15px] font-medium text-brand-terracotta hover:underline">What Kind of Insurance Does 100Handy Offer?</Link></li>
                    <li><Link href="/help/trust-safety#support-fee" className="text-[15px] font-medium text-brand-terracotta hover:underline">What is the 100Handy Trust & Support Fee?</Link></li>
                    <li><Link href="/terms" className="text-[15px] font-medium text-brand-terracotta hover:underline">100Handy Global Terms of Service</Link></li>
                    <li><Link href="/help/trust-safety#happiness-pledge" className="text-[15px] font-medium text-brand-terracotta hover:underline">The 100Handy Happiness Pledge</Link></li>
                    <li><Link href="/terms" className="text-[15px] font-medium text-brand-terracotta hover:underline">100Handy Global Privacy Policy</Link></li>
                </ul>
            </div>
            
            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-8">
                 <div className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-12 h-12 rounded-xl bg-brand-terracotta flex items-center justify-center mb-4">
                         <MailIcon />
                    </div>
                    <h3 className="text-[20px] font-bold text-brand-dark-alt">Can't find what you need?</h3>
                    <p className="text-base text-brand-dark-alt mt-2">Contact us and we'll get back to you as soon as we can.</p>
                </div>
                 <div className="border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                         <LogoIcon />
                    </div>
                    <h3 className="text-[20px] font-bold text-brand-dark-alt">Ready to book a task?</h3>
                    <p className="text-base text-brand-dark-alt mt-2">Head over to our website to see our available categories!</p>
                </div>
            </div>
        </main>
    );
};

const HelpButton = () => {
    return (
        <button aria-label="Get help" className="fixed bottom-6 left-6 bg-brand-terracotta text-white p-4 rounded-full shadow-lg hover:bg-brand-terracotta/85 transition-colors flex items-center justify-center">
            <HelpIcon />
        </button>
    );
};

// --- Main Page Component --- //

export default function TrustSafetyPage() {
  return (
    <>
        <div className="bg-white min-h-screen">
            <Header />
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto">
                <Sidebar />
                <MainContent />
            </div>
            <Footer />
            <HelpButton />
        </div>
    </>
  )
}