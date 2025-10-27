"use client";
import React, { useState } from 'react';
import { Header, Footer } from "@/components/layout";
import { Search, Mail, HelpCircle } from "lucide-react";
import { LogoIcon, MailIcon, HelpIcon } from "@/components/icons";



const Sidebar = () => {
    const links = [
        { name: "Overview of trust and safety", active: true },
        { name: "What kind of insurance does 100Handy offer?", active: false },
        { name: "Limitations of insurance", active: false },
        { name: "Safety guidelines", active: false },
    ];
    return (
        <aside className="w-full lg:w-[280px] lg:border-r border-[#EBEBEB] p-8 lg:pt-12 bg-[#F7F7F7] lg:bg-transparent">
            <h2 className="text-[18px] font-semibold text-[#30352D] mb-4">Article in this section</h2>
            <nav className="flex flex-col space-y-2">
                {links.map((link) => (
                    <a 
                        key={link.name} 
                        href="#"
                        className={`text-[15px] px-4 py-3 rounded-[4px] transition-colors ${
                            link.active 
                                ? 'bg-[#C1856A] text-white font-bold' 
                                : 'text-[#C1856A] font-medium hover:bg-gray-200'
                        }`}
                    >
                        {link.name}
                    </a>
                ))}
            </nav>
        </aside>
    );
}

const MainContent = () => {
    return (
        <main className="flex-1 max-w-full lg:max-w-[800px] px-6 md:px-12 py-12">
            {/* Breadcrumbs */}
            <p className="text-sm text-[#6B7A6B] mb-6">
                100Handy Support / policy center / trust and safety / policy basics
            </p>

            {/* Title */}
            <h1 className="text-[42px] font-bold text-[#30352D] leading-tight tracking-[-0.5px] mb-8">
                Overview of Trust and Safety
            </h1>

            {/* Article Content */}
            <div className="space-y-8 text-[15px] text-[#30352D] leading-[1.7]">
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
            <div className="text-center my-12 border-t border-b border-[#EBEBEB] py-8">
                <p className="text-[16px] font-medium text-[#30352D] mb-4">Was this article helpful?</p>
                <div className="flex justify-center space-x-4">
                    <button className="px-6 py-2 border border-[#D0D0D0] rounded-[4px] text-[#30352D] text-base font-medium hover:bg-[#F7F7F7] hover:border-[#C1856A] transition-colors">Yes</button>
                    <button className="px-6 py-2 border border-[#D0D0D0] rounded-[4px] text-[#30352D] text-base font-medium hover:bg-[#F7F7F7] hover:border-[#C1856A] transition-colors">No</button>
                </div>
                <p className="text-sm text-[#6B7A6B] mt-4">1200 out of 2120 found this helpful</p>
                <p className="text-sm text-[#6B7A6B] mt-2">Have more questions? <a href="#" className="text-[#C1856A] hover:underline">Submit a request</a></p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h4 className="text-[16px] font-bold mb-1">Previous article</h4>
                    <a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">What are the Perks of Elite Status?</a>
                </div>
                <div className="text-right">
                    <h4 className="text-[16px] font-bold mb-1">Next article</h4>
                    <a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">What Kind of Insurance Does 100Handy Offer?</a>
                </div>
            </div>

            {/* Related Articles */}
            <div className="mb-12">
                <h3 className="text-[20px] font-bold text-[#30352D] mb-4">Related articles</h3>
                <ul className="space-y-4">
                    <li><a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">What Kind of Insurance Does 100Handy Offer?</a></li>
                    <li><a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">What is the 100Handy Trust & Support Fee?</a></li>
                    <li><a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">100Handy Global Terms of Service</a></li>
                    <li><a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">The 100Handy Happiness Pledge</a></li>
                    <li><a href="#" className="text-[15px] font-medium text-[#C1856A] hover:underline">100Handy Global Privacy Policy</a></li>
                </ul>
            </div>
            
            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-8">
                 <div className="border border-[#EBEBEB] rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-[#C1856A] flex items-center justify-center mb-4">
                         <MailIcon />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#30352D]">Can't find what you need?</h3>
                    <p className="text-base text-[#30352D] mt-2">Contact us and we'll get back to you as soon as we can.</p>
                </div>
                 <div className="border border-[#EBEBEB] rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                         <LogoIcon />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#30352D]">Ready to book a task?</h3>
                    <p className="text-base text-[#30352D] mt-2">Head over to our website to see our available categories!</p>
                </div>
            </div>
        </main>
    );
};

const HelpButton = () => {
    return (
        <button className="fixed bottom-6 left-6 bg-[#C1856A] text-white p-4 rounded-full shadow-lg hover:bg-[#A86F57] transition-colors flex items-center justify-center">
            <HelpIcon />
        </button>
    );
};

// --- Main Page Component --- //

export default function TrustSafetyPage() {
  return (
    <>
        <div className="bg-[#FFFFFF] min-h-screen">
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