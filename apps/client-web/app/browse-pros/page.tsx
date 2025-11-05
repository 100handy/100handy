"use client";

import { useState } from "react";
import {
  TaskerCard,
  BrowseFilters,
  PeaceOfMindCard,
  StepIndicator,
} from "@/components/browse-pros";
import { ConfirmDetails } from "@/components/confirm-booking/confirm-details";
import { TaskSummary } from "@/components/confirm-booking/task-summary";

const mockTaskers = Array.from({ length: 7 }, (_, i) => ({
  user_id: `tasker-${i}`,
  first_name: "Mike",
  last_name: "W.",
  display_name: "Mike W.",
  rating: 5.0,
  review_count: 124,
  hourly_rate_cents: 7027, // £70.27
  experience_years: 8,
  jobs_completed: 438,
  bio: "I have 8 years of experience. I come with all the right rawlplugs, fixings and tools and not forgetting my trust…",
  avatar_url: "/images/tasker-placeholder.jpg",
  verified: true,
  created_at: new Date().toISOString(),
  phone: null,
  postcode: null,
}));

export default function BrowseProsPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Step Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#F9F5F1]">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <p className="text-[#30352D] text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block mr-2 align-text-bottom"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {currentStep === 2 ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.282-.24-1.88M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.282.24-1.88m11.52 1.88l-4.52-4.52m-4.52 4.52l4.52-4.52M9 11a3 3 0 100-6 3 3 0 000 6z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              )}
            </svg>
            {currentStep === 2
              ? "Filter and sort to find your 100Handy Pro. Then view their availability to request your date and time."
              : "You're almost done! We just need a few more details to connect you with your Pro."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentStep === 2 ? (
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="w-80 flex-shrink-0 space-y-6">
              <BrowseFilters />
              <PeaceOfMindCard />
            </aside>

            {/* Taskers List */}
            <main className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-medium text-[#30352D]">
                    Browse Pros & Prices
                  </h1>
                  <p className="text-[#30352D] text-base leading-relaxed mt-1">
                    Filter and sort to find your 100Handy Pro. Then view their
                    availability to request your date and time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sorted by:
                  </span>
                  <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                    <option>Recommended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {mockTaskers.map((handyman) => (
                  <TaskerCard 
                    key={handyman.user_id} 
                    handyman={handyman}
                    categoryName="Handyman"
                    onSelectContinue={(date: string, time: string) => {
                      console.log('Selected date:', date, 'time:', time);
                      setCurrentStep(3);
                    }}
                  />
                ))}
              </div>
            </main>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Payment Form */}
            <ConfirmDetails 
              onPaymentSuccess={(paymentIntentId: string) => {
                console.log('Payment successful:', paymentIntentId);
                // Handle successful payment
              }}
              onPaymentError={(error: string) => {
                console.error('Payment error:', error);
                // Handle payment error
              }}
              isSubmitting={isSubmitting}
            />

            {/* Right Column - Task Summary */}
            <TaskSummary />
          </div>
        )}
      </div>
    </div>
  );
}
