"use client";
import React, { useState } from 'react';
import { Header, Footer } from "@/components/layout";
import { GiftIcon, HelpIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";

// --- Components --- //

const ReferralContent = () => {
    const referralLink = "https://www.100handy.co.uk/s/graswfij";
    const [buttonText, setButtonText] = useState("Copy link");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setButtonText("Copied!");
            setTimeout(() => setButtonText("Copy link"), 2000);
        });
    };

    return (
        <main className="flex-1 flex items-center justify-center py-12 md:py-24 px-6">
            <div className="w-full max-w-3xl border border-[#E0E0E0] rounded-lg p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#30352D] mb-4">Help Your Friends, Get £10</h1>
                        <p className="text-base text-[#30352D] mb-8">
                            Refer a friend to 100Handy. They get £10 off their first task. You get £10 off when they complete it.
                        </p>
                    </div>
                    <div className="bg-[#F7F3F0] p-6 rounded-full">
                        <GiftIcon />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="email" 
                                placeholder="Enter email address" 
                                className="flex-grow p-3 border border-[#D0D0D0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C1856A]"
                            />
                            <button className="bg-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
                                Send Invite
                            </button>
                        </div>
                        <p className="text-xs text-[#6B7A6B] mt-2">
                            Separate email recipients with commas (eg: friend1@gmail.com, friend2@gmail.com)
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                       <input 
                           type="text" 
                           readOnly 
                           value={referralLink}
                           className="flex-grow p-3 border border-[#D0D0D0] rounded-md bg-gray-50 text-[#30352D] focus:outline-none"
                       />
                        <button 
                            onClick={copyToClipboard}
                            className="bg-white text-[#C1856A] border border-[#C1856A] font-semibold px-6 py-3 rounded-md hover:bg-[#F7F3F0] transition-colors"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

const HelpButton = () => {
    return (
        <button className="fixed bottom-6 left-6 bg-[#A0B194] text-white p-4 rounded-full shadow-lg hover:bg-[#8a9a7e] transition-colors flex items-center justify-center">
            <HelpIcon />
        </button>
    );
};

// --- Main Page Component --- //

export default function ReferralPage() {
  return (
    <>
        <div className="bg-[#F8F9FA] min-h-screen flex flex-col">
            <Header showSearch={false} />
            <ReferralContent />
            <Footer />
            <HelpButton />
        </div>
    </>
  )
}