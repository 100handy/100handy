"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TaskerCard,
  BrowseFilters,
  PeaceOfMindCard,
  StepIndicator,
} from "@/components/browse-pros";
import { ConfirmDetails } from "@/components/confirm-booking/confirm-details";
import { TaskSummary } from "@/components/confirm-booking/task-summary";
import { useAuthContext } from "@/components/providers/auth-provider";
import { usePendingBookingStore, useLocationStore, type PendingBookingData } from "@shared/supabase";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const { setPendingBooking, getPendingBooking, clearPendingBooking } = usePendingBookingStore();
  const { setLocation, location } = useLocationStore();

  const [currentStep, setCurrentStep] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTasker, setSelectedTasker] = useState<typeof mockTaskers[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Category from URL params or default
  const categoryId = searchParams.get('categoryId') || 'handyman';
  const categoryName = searchParams.get('categoryName') || 'Handyman';

  // Check for pending booking on mount (after auth completes)
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      const pendingBooking = getPendingBooking();
      if (pendingBooking) {
        // Restore the state from pending booking
        setLocation(pendingBooking.location);
        setSelectedDate(pendingBooking.selectedDate);
        setSelectedTime(pendingBooking.selectedTime);
        // Find matching tasker from mock data (in real app, fetch from API)
        const tasker = mockTaskers.find(t => t.user_id === pendingBooking.tasker.id);
        if (tasker) {
          setSelectedTasker(tasker);
          setCurrentStep(3);
        }
      }
    }
  }, [authLoading, isAuthenticated]);

  // Save pending booking and redirect to sign up
  const savePendingBookingAndRedirect = (tasker: typeof mockTaskers[0], date: string, time: string) => {
    const pendingBookingData: PendingBookingData = {
      categoryId,
      categoryName,
      tasker: {
        id: tasker.user_id,
        userId: tasker.user_id,
        displayName: tasker.display_name,
        avatarUrl: tasker.avatar_url,
        hourlyRateCents: tasker.hourly_rate_cents,
        verified: tasker.verified,
        rating: tasker.rating,
      },
      selectedDate: date,
      selectedTime: time,
      location: location || {
        streetAddress: '',
        city: '',
        country: 'UK',
        postalCode: '',
      },
      formResponses: {},
      createdAt: Date.now(),
      returnPath: '/browse-pros',
    };

    setPendingBooking(pendingBookingData);

    // Redirect to sign up page
    router.push('/auth/sign-up?redirect=/browse-pros');
  };

  // Handle tasker selection and check auth
  const handleSelectContinue = (tasker: typeof mockTaskers[0], date: string, time: string) => {
    if (!isAuthenticated) {
      // Save booking data and redirect to sign up
      savePendingBookingAndRedirect(tasker, date, time);
      return;
    }

    // User is authenticated, proceed to step 3
    setSelectedTasker(tasker);
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(3);
  };

  // Handle going back from step 3 to step 2
  const handleBackToStep2 = () => {
    // Clear pending booking when user manually goes back
    clearPendingBooking();
    setCurrentStep(2);
    setSelectedTasker(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Handle successful booking completion
  const handleBookingSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    // Clear pending booking after successful completion
    clearPendingBooking();
    // Navigate to success page or show success message
    router.push('/booking-success');
  };

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
                    categoryName={categoryName}
                    onSelectContinue={(date: string, time: string) => {
                      handleSelectContinue(handyman, date, time);
                    }}
                  />
                ))}
              </div>
            </main>
          </div>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={handleBackToStep2}
              className="mb-6 flex items-center gap-2 text-[#30352D] hover:text-[#C1856A] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Taskers
            </button>

            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Left Column - Payment Form */}
              <ConfirmDetails
                onPaymentSuccess={handleBookingSuccess}
                onPaymentError={(error: string) => {
                  console.error('Payment error:', error);
                  // Handle payment error
                }}
                isSubmitting={isSubmitting}
              />

              {/* Right Column - Task Summary */}
              <TaskSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
