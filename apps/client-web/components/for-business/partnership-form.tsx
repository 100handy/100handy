"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Portugal",
  "Other",
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
  "Other",
];

export function PartnershipForm({
  title,
  intro,
  successTitle,
  successMessage,
  footerLinkText,
  footerLinkCta,
}: {
  title: string
  intro: string
  successTitle: string
  successMessage: string
  footerLinkText: string
  footerLinkCta: string
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    estimatedTasks: "",
    additionalDetails: "",
  });
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Partnership form submitted:", { ...formData, selectedCountries, selectedTaskTypes });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1920px] px-8">
          <div className="mx-auto max-w-[539px] text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-[29px] font-bold text-brand-dark-alt">{successTitle}</h2>
            <p className="text-[20px] leading-relaxed text-brand-dark-alt">{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1920px] px-8">
        <div className="mx-auto max-w-[539px]">
          <h2 className="mb-6 text-[29px] font-bold text-brand-dark-alt">{title}</h2>
          <p className="mb-10 text-[20px] leading-relaxed text-brand-dark-alt">{intro}</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField label="Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" />
            <FormField label="Business Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your business email" />
            <FormField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" />
            <FormField label="Company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Enter your company name" />
            <FormField label="Website" name="website" type="url" value={formData.website} onChange={handleInputChange} placeholder="Enter your website URL" />

            <div>
              <label className="mb-3 block text-[15px] text-brand-dark-alt">In which countries do you operate?</label>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => toggleSelection(country, selectedCountries, setSelectedCountries)}
                    className={`rounded-full border px-4 py-2 text-[20px] transition-colors ${
                      selectedCountries.includes(country)
                        ? "border-brand-terracotta bg-brand-terracotta text-white"
                        : "border-gray-300 bg-white text-brand-dark-alt hover:border-brand-terracotta"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            <FormField
              label="Estimated number of tasks/jobs per month"
              name="estimatedTasks"
              value={formData.estimatedTasks}
              onChange={handleInputChange}
              placeholder="Enter number of tasks or job per month"
            />

            <div>
              <label className="mb-3 block text-[24px] text-brand-dark-alt">What type of tasks can we assist you with?</label>
              <div className="flex flex-wrap gap-2">
                {taskTypes.map((taskType) => (
                  <button
                    key={taskType}
                    type="button"
                    onClick={() => toggleSelection(taskType, selectedTaskTypes, setSelectedTaskTypes)}
                    className={`rounded-full border px-4 py-2 text-[20px] transition-colors ${
                      selectedTaskTypes.includes(taskType)
                        ? "border-brand-terracotta bg-brand-terracotta text-white"
                        : "border-gray-300 bg-white text-brand-dark-alt hover:border-brand-terracotta"
                    }`}
                  >
                    {taskType}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="additionalDetails" className="mb-3 block text-[24px] text-brand-dark-alt">
                How can 100Handy help your customers or business?
              </label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="Enter in any additional details about your task(s)."
                rows={6}
                className="w-full resize-none rounded border border-gray-300 px-4 py-3 text-[24px] focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-auto rounded-full bg-brand-terracotta px-12 py-4 text-[20px] font-semibold text-white transition-colors hover:bg-brand-coral disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>

            <div>
              <p className="text-[20px] text-brand-dark-alt">
                {footerLinkText}{" "}
                <Link href="/become-100-handy-pro" className="text-brand-terracotta underline hover:text-brand-coral">
                  {footerLinkCta}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[15px] text-brand-dark-alt">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded border border-gray-300 px-4 py-3 text-[20px] focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
      />
    </div>
  );
}
