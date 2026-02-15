"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/marketing/footer";
import { HelpIcon } from "@/components/icons";

// --- Data --- //
const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Portugal",
  "Other"
];

const taskTypes = [
  "Furniture Assembly",
  "Yard Work & Removal",
  "Mounting",
  "Lift & Shift Furniture",
  "Smart Home Installation",
  "Plumbing Help",
  "Delivery",
  "Electrical Help",
  "Cleaning",
  "Home Improvements",
  "Other"
];

// --- Components --- //

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-8 py-4">
        <div className="flex items-center">
          <svg width="253" height="38" viewBox="0 0 253 38" className="text-brand-dark">
            <text x="0" y="30" fontSize="32" fontWeight="bold" fill="currentColor">100HANDY</text>
          </svg>
        </div>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="bg-white pt-16 pb-8">
      <div className="max-w-[1920px] mx-auto px-8 text-center">
        <h1 className="text-brand-dark-alt font-bold text-[42px] mb-6">
          Boost sales — without adding operational load
        </h1>
        <p className="text-brand-dark-alt text-[24px] mb-10">
          100 Handy partners with retailers and service-led brands to provide trusted assembly, mounting, and installation — so customers get a complete &quot;buy-to-done&quot; experience.
        </p>
        <button className="bg-brand-terracotta hover:bg-brand-coral text-white font-semibold py-3 px-8 rounded-md transition-colors text-[20px] mb-4">
          Get in touch to learn more
        </button>
        <div className="flex justify-center">
          <svg className="w-12 h-16 text-brand-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="text-center">
            <div className="w-[160px] h-[160px] mx-auto mb-8 bg-brand-dark rounded-full flex items-center justify-center overflow-hidden">
              <svg width="180" height="136" viewBox="0 0 180 136" className="text-gray-500">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.5" />
                <polygon points="90,10 170,126 10,126" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4 leading-tight">
              Build Customer Loyalty
            </h3>
            <p className="text-brand-dark-alt text-[20px] leading-relaxed">
              Offer a convenient, reliable solution for assembly and installation — so your customers feel supported from delivery to done.
            </p>
          </div>

          <div className="text-center">
            <div className="w-[160px] h-[160px] mx-auto mb-8 bg-brand-dark rounded-full flex items-center justify-center overflow-hidden">
              <svg width="180" height="136" viewBox="0 0 180 136" className="text-gray-500">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.5" />
                <polygon points="90,10 170,126 10,126" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4 leading-tight">
              Increase Sales & Reduce Returns
            </h3>
            <p className="text-brand-dark-alt text-[20px] leading-relaxed">
              When customers know help is available, they&apos;re more likely to buy — and less likely to return items because setup felt overwhelming.
            </p>
          </div>

          <div className="text-center">
            <div className="w-[160px] h-[160px] mx-auto mb-8 bg-brand-dark rounded-full flex items-center justify-center overflow-hidden">
              <svg width="180" height="136" viewBox="0 0 180 136" className="text-gray-500">
                <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.5" />
                <polygon points="90,10 170,126 10,126" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <h3 className="text-brand-dark-alt font-bold text-[32px] mb-4 leading-tight">
              Seamless Integration
            </h3>
            <p className="text-brand-dark-alt text-[20px] leading-relaxed">
              We can support scheduling and service workflows to make booking and payment feel effortless for your customers and your team.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-brand-terracotta hover:bg-brand-coral text-white font-semibold py-3 px-8 rounded-md transition-colors text-[20px] mb-4">
            Get in touch to learn more
          </button>
          <div className="flex justify-center">
            <svg className="w-12 h-16 text-brand-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const DecorativeSection = () => {
  return (
    <section className="bg-brand-dark py-32">
      <div className="max-w-[1920px] mx-auto px-8 flex items-center justify-center">
        <svg width="710" height="536" viewBox="0 0 710 536" className="text-gray-500">
          <circle cx="200" cy="150" r="120" fill="currentColor" opacity="0.5" />
          <polygon points="355,0 710,536 0,536" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </section>
  );
};

const FormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    estimatedTasks: "",
    additionalDetails: ""
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", { ...formData, selectedCountries, selectedTaskTypes });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="max-w-[539px] mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-brand-dark-alt font-bold text-[29px] mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-brand-dark-alt text-[20px] leading-relaxed">
              We&apos;ve received your inquiry and will be in touch within 2 business days to discuss partnership opportunities.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="max-w-[539px] mx-auto">
          <h2 className="text-brand-dark-alt font-bold text-[29px] mb-6">
            Want to Learn More About Partnering With 100 Handy?
          </h2>
          <p className="text-brand-dark-alt text-[20px] mb-10 leading-relaxed">
            Tell us a bit about your business and what you&apos;re looking to enable. We&apos;ll follow up with relevant details, example workflows, and a case study — then explore the best partnership model for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-brand-dark-alt text-[15px] mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Business Email */}
            <div>
              <label htmlFor="email" className="block text-brand-dark-alt text-[15px] mb-2">
                Business Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your business email"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-brand-dark-alt text-[15px] mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-brand-dark-alt text-[15px] mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-brand-dark-alt text-[15px] mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter your website URL"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Countries */}
            <div>
              <label className="block text-brand-dark-alt text-[15px] mb-3">
                In which countries do you operate?
              </label>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleSelection(country, selectedCountries, setSelectedCountries)}
                    className={`px-4 py-2 rounded-full border transition-colors text-[20px] ${
                      selectedCountries.includes(country)
                        ? "bg-brand-terracotta text-white border-brand-terracotta"
                        : "bg-white text-brand-dark-alt border-gray-300 hover:border-brand-terracotta"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Tasks */}
            <div>
              <label htmlFor="estimatedTasks" className="block text-brand-dark-alt text-[15px] mb-2">
                Estimated number of tasks/jobs per month
              </label>
              <input
                type="text"
                id="estimatedTasks"
                name="estimatedTasks"
                value={formData.estimatedTasks}
                onChange={handleInputChange}
                placeholder="Enter number of tasks or job per month"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[20px]"
              />
            </div>

            {/* Task Types */}
            <div>
              <label className="block text-brand-dark-alt text-[24px] mb-3">
                What type of tasks can we assist you with?
              </label>
              <div className="flex flex-wrap gap-2">
                {taskTypes.map((taskType) => (
                  <button
                    key={taskType}
                    type="button"
                    onClick={() => toggleSelection(taskType, selectedTaskTypes, setSelectedTaskTypes)}
                    className={`px-4 py-2 rounded-full border transition-colors text-[20px] ${
                      selectedTaskTypes.includes(taskType)
                        ? "bg-brand-terracotta text-white border-brand-terracotta"
                        : "bg-white text-brand-dark-alt border-gray-300 hover:border-brand-terracotta"
                    }`}
                  >
                    {taskType}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label htmlFor="additionalDetails" className="block text-brand-dark-alt text-[24px] mb-3">
                How can 100Handy help your customers or business?
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="Enter in any additional details about your task(s)."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-[24px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-terracotta hover:bg-brand-coral text-white font-semibold py-4 px-12 rounded-md transition-colors text-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Footer Link */}
            <div>
              <p className="text-brand-dark-alt text-[20px]">
                Looking to sign up as a Handy?{" "}
                <Link href="/become-tasker" className="text-brand-terracotta underline hover:text-brand-coral">
                  Submit your application here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const HelpButton = () => {
  return (
    <button className="fixed bottom-6 left-6 bg-brand-sage text-white p-4 rounded-full shadow-lg hover:bg-brand-sage/85 transition-colors flex items-center justify-center">
      <HelpIcon />
    </button>
  );
};

// --- Main Page Component --- //

export default function ForBusinessPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <DecorativeSection />
      <FormSection />
      <Footer />
      <HelpButton />
    </div>
  );
}
