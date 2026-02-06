import React from 'react';
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import { MessageIcon, SendEmailIcon, PhoneIcon, HelpIcon } from "@/components/icons";

// --- Components --- //

const ContactCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
    <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-brand-terracotta transition-all cursor-pointer">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold text-brand-dark-alt text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{text}</p>
    </div>
);

const ContactUsContent = () => {
    return (
        <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-12">
            <p className="text-sm text-gray-500 mb-6">
                100Handy Support / Submit a request
            </p>
            <h1 className="text-4xl font-bold text-brand-dark-alt mb-10">Contact Us</h1>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                <ContactCard icon={<MessageIcon />} title="Message us" text="Click here to reach out!" />
                <ContactCard icon={<SendEmailIcon />} title="Send us an email" text="Available every day" />
                <ContactCard icon={<PhoneIcon />} title="Give us a call" text="Toll free for US and Canada" />
            </div>

            <div className="border-t border-gray-200 pt-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-dark-alt mb-2">Send us an email</h2>
                    <p className="text-base text-gray-500">
                        Please provide detailed information below and our agents will reply via email as soon as possible.
                    </p>
                </div>

                <form className="space-y-6 max-w-2xl mx-auto">
                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-brand-dark-alt mb-2">Tell us about you</label>
                        <select id="about" name="about" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta">
                            <option>-</option>
                            <option>General Inquiry</option>
                            <option>Booking Help</option>
                            <option>Billing Issue</option>
                            <option>Feedback</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark-alt mb-2">Your email address</label>
                        <input type="email" id="email" name="email" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta" />
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-brand-dark-alt mb-2">Subject</label>
                        <input type="text" id="subject" name="subject" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-dark-alt mb-2">Description</label>
                        <textarea id="description" name="description" rows={6} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta"></textarea>
                    </div>
                    <div>
                         <label htmlFor="attachments" className="block text-sm font-medium text-brand-dark-alt mb-2">Attachments (optional)</label>
                         <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-brand-terracotta">
                            <input type="file" id="attachments" name="attachments" className="sr-only" multiple />
                            <p className="text-sm text-gray-500">
                                <label htmlFor="attachments" className="font-medium text-brand-terracotta hover:underline cursor-pointer">Add file</label> or drop files here
                            </p>
                         </div>
                    </div>
                    <div>
                        <button type="submit" className="w-auto bg-brand-terracotta text-white font-semibold px-8 py-3 rounded-md hover:bg-brand-terracotta/85 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-terracotta">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

const HelpButton = () => {
    return (
        <button aria-label="Get help" className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
            <HelpIcon />
        </button>
    );
};

// --- Main Page Component --- //

export default function ContactPage() {
  return (
    <>
        <div className="bg-white min-h-screen">
            <Header />
            <ContactUsContent />
            <Footer />
            <HelpButton />
        </div>
    </>
  )
}