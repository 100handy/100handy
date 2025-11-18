"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import {
  TaskerCard,
  BrowseFilters,
  PeaceOfMindCard,
} from "@/components/browse-pros";
import type { FilterValues } from "@/components/browse-pros/browse-filters";
import { ConfirmDetails } from "@/components/confirm-booking/confirm-details";
import { TaskSummary } from "@/components/confirm-booking/task-summary";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { DynamicFormRenderer } from "@/components/booking";
import { getCategoryByName } from "@/lib/supabase/categories";
import { getHandymenByCategory, type HandymanProfile } from "@/lib/supabase/handymen";
import { findOrCreateAddress } from "@/lib/supabase/addresses";
import { createBooking } from "@/lib/supabase/bookings";
import { createPaymentIntent } from "@/lib/stripe/payment";
import { createClient } from "@/lib/supabase";
import type { Category } from "@/lib/supabase/types";
import type { FormResponse } from "@shared/supabase";

function TaskFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");

  // Task details state
  const [category, setCategory] = useState<Category | null>(null);
  const [taskCategory, setTaskCategory] = useState(categoryFromUrl || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [unitFlat, setUnitFlat] = useState("");
  const [googlePlaceData, setGooglePlaceData] = useState<any>(null);
  const [formResponses, setFormResponses] = useState<FormResponse>({});

  // Flow state
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [taskOptionsCompleted, setTaskOptionsCompleted] = useState(false);
  const [showBrowsePros, setShowBrowsePros] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Data state
  const [handymen, setHandymen] = useState<HandymanProfile[]>([]);
  const [filteredHandymen, setFilteredHandymen] = useState<HandymanProfile[]>([]);
  const [selectedHandyman, setSelectedHandyman] = useState<HandymanProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [addressId, setAddressId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment state
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");


  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Store current path to return after login
        sessionStorage.setItem('returnPath', window.location.pathname + window.location.search);
        router.push('/sign-in');
        return;
      }

      setUserId(user.id);
    };

    checkAuth();
  }, [router]);

  // Load category from URL
  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryFromUrl) {
        setError('No category specified. Please select a service category.');
        return;
      }

      try {
        const cat = await getCategoryByName(categoryFromUrl);
        if (cat) {
          setCategory(cat);
          setTaskCategory(cat.name);
          setError(null); // Clear any previous errors
        } else {
          setError(`Category "${categoryFromUrl}" not found. Please select a valid service from the homepage.`);
        }
      } catch (error) {
        console.error('Error loading category:', error);
        setError('Failed to load category. Please try again or select a different service.');
      }
    };

    loadCategory();
  }, [categoryFromUrl]);

  const handleLocationContinue = async () => {
    if (!streetAddress.trim() || !userId) return;

    try {
      setLoading(true);
      setError(null);

      // Create or find address in database
      const address = await findOrCreateAddress(
        userId,
        googlePlaceData || { formatted_address: streetAddress },
        unitFlat
      );

      if (address) {
        setAddressId(address.id);
        setLocationConfirmed(true);
      } else {
        setError('Failed to save address. Please try again.');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (responses: FormResponse) => {
    setFormResponses(responses);
    setTaskOptionsCompleted(true);
    // Automatically proceed to browse pros after form is filled
    handleBrowsePros();
  };

  const handleBrowsePros = async () => {
    // Debug logging
    console.log('handleBrowsePros called', { category, userId, categoryFromUrl });

    if (!category || !userId) {
      const missingItems = [];
      if (!category) missingItems.push('category');
      if (!userId) missingItems.push('userId');
      setError(`Cannot load handymen: Missing ${missingItems.join(' and ')}`);
      console.error('Missing required data:', { category, userId });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching handymen for category:', category.id, category.name);

      // Fetch handymen for this category
      const handymenData = await getHandymenByCategory(category.id);
      console.log('Fetched handymen:', handymenData.length, handymenData);

      if (handymenData.length === 0) {
        setError('No handymen available for this category yet. Please try another service or check back later.');
      }

      setHandymen(handymenData);
      setFilteredHandymen(handymenData);
      setShowBrowsePros(true);
    } catch (err: any) {
      console.error('Error fetching handymen:', err);
      console.error('Error details:', {
        message: err?.message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
      });
      setError(`Failed to load handymen: ${err?.message || 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHandyman = async (handyman: HandymanProfile, date: string, time: string) => {
    setSelectedHandyman(handyman);
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBrowsePros(false);
    setShowConfirmation(true);

    try {
      setLoading(true);
      setError(null);

      // Calculate the amount for authorization hold (minimum 2 hours)
      const taskSize = formResponses.task_size as string | undefined;
      const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'large' ? 4 : 2.5; // Default to medium
      const minimumHours = Math.max(2, estimatedHours); // Minimum 2 hours
      const amount = handyman.hourly_rate_cents * minimumHours;

      // Create payment intent for authorization hold
      const paymentIntent = await createPaymentIntent({
        amount,
        currency: 'gbp',
        metadata: {
          handyman_id: handyman.user_id,
          category_id: category?.id || '',
          estimated_hours: estimatedHours.toString(),
        },
      });

      if (paymentIntent) {
        setPaymentIntentClientSecret(paymentIntent.clientSecret);
        setPaymentIntentId(paymentIntent.paymentIntentId);
      } else {
        setError('Failed to initialize payment. Please try again.');
        setShowConfirmation(false);
        setShowBrowsePros(true);
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to initialize payment. Please try again.');
      setShowConfirmation(false);
      setShowBrowsePros(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((filters: FilterValues) => {
    // Apply filters to handymen list
    let filtered = [...handymen];

    // Filter by price range (convert to pounds for comparison)
    filtered = filtered.filter(handyman => {
      const hourlyRate = handyman.hourly_rate_cents / 100;
      return hourlyRate >= filters.priceMin && hourlyRate <= filters.priceMax;
    });

    // Filter by elite status (verified)
    if (filters.isEliteTasker) {
      filtered = filtered.filter(handyman => handyman.verified);
    }

    // TODO: Add date/time availability filtering when we have availability data

    setFilteredHandymen(filtered);
  }, [handymen]);

  const handlePaymentSuccess = async (authorizedPaymentIntentId: string) => {
    // Payment authorization successful! Now create the booking
    if (!userId || !selectedHandyman || !category || !addressId) {
      setError('Missing required booking information');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Estimate hours based on task size from form responses
      const taskSize = formResponses.task_size as string | undefined;
      const estimatedHours = taskSize === 'small' ? 1 : taskSize === 'large' ? 4 : 2.5; // Default to medium

      const booking = await createBooking({
        customer_id: userId,
        handy_id: selectedHandyman.user_id,
        category_id: category.id,
        task_title: category.name,
        task_details: (formResponses.additional_details as string) || undefined,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        address_id: addressId,
        hourly_rate_cents: selectedHandyman.hourly_rate_cents,
        estimated_hours: estimatedHours,
        form_responses: formResponses,
        payment_intent_id: authorizedPaymentIntentId,
      });

      if (booking) {
        console.log('Booking created successfully:', booking);
        console.log('Payment authorized (ID):', authorizedPaymentIntentId);

        // Navigate to booking confirmation page
        router.push(`/bookings/${booking.id}`);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSubmitting(false);
  };

  const handleEditTask = () => {
    setShowConfirmation(false);
    setShowBrowsePros(true);
  };

  // Memoize the place selected callback to prevent Google Autocomplete from re-initializing
  const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
    setGooglePlaceData(place);
    if (place.formatted_address) {
      setStreetAddress(place.formatted_address);
    }
  }, []);

  const getCurrentStep = () => {
    if (showConfirmation) return 3;
    if (showBrowsePros) return 2;
    return 1;
  };

  const steps = [
    { number: 1, label: "Describe your task", active: getCurrentStep() === 1 },
    { number: 2, label: "", active: getCurrentStep() === 2 },
    { number: 3, label: "Confirm details", active: getCurrentStep() === 3 },
    { number: 4, label: "", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Progress Stepper */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                100<span className="font-normal">HANDY</span>
              </span>
            </Link>

            {/* Progress Stepper */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        step.active
                          ? "bg-brand-terracotta text-white"
                          : "bg-gray-300 text-white"
                      }`}
                    >
                      {step.number}
                    </div>
                    {step.label && (
                      <span className="text-xs text-brand-dark whitespace-nowrap">
                        {step.label}
                      </span>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Empty space for balance */}
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-[#F5E6D3] py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-brand-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="flex-1">
              {showConfirmation ? (
                <p className="text-brand-dark text-sm">
                  {"You're almost done! We just need a few more details to connect you with your Pro."}
                </p>
              ) : (
                <>
                  <p className="text-brand-dark text-sm">
                    Tell us about your task. We use these details to show Taskers in your area
                  </p>
                  <p className="text-brand-dark text-sm">Who fit your needs.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {showConfirmation ? (
            /* Confirmation Step */
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Left Column - Payment Form */}
              <ConfirmDetails
                clientSecret={paymentIntentClientSecret}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isSubmitting={isSubmitting}
              />

              {/* Right Column - Task Summary */}
              <TaskSummary
                handymanName={selectedHandyman?.display_name || `${selectedHandyman?.first_name} ${selectedHandyman?.last_name?.charAt(0)}.` || 'Handyman'}
                handymanAvatar={selectedHandyman?.avatar_url || '/images/default-avatar.png'}
                scheduledDate={selectedDate}
                scheduledTime={selectedTime}
                address={streetAddress}
                taskSize={formResponses.task_size as string}
                vehicleRequirement={formResponses.vehicle_requirement as string}
                taskDetails={(formResponses.additional_details as string) || 'No details provided'}
                hourlyRateCents={selectedHandyman?.hourly_rate_cents || 0}
                onEdit={handleEditTask}
              />

              {/* Error Message */}
              {error && (
                <div className="col-span-full mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          ) : !showBrowsePros ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Error Message (shown at top if category fails to load) */}
              {error && !category && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm mb-2">{error}</p>
                  <Link
                    href="/"
                    className="text-brand-terracotta hover:underline text-sm font-medium"
                  >
                    ← Return to homepage to select a service
                  </Link>
                </div>
              )}

              {/* Task Title */}
              <h1 className="text-brand-dark font-bold text-2xl sm:text-3xl">
                {taskCategory || 'Select a Service'}
              </h1>

            {/* Your task location */}
            <div className="bg-white rounded-lg border border-gray-300 p-6">
              {!locationConfirmed ? (
                // Edit Mode - Show input fields
                <>
                  <h2 className="text-brand-dark font-semibold text-lg mb-4">
                    Your task location
                  </h2>

                  <div className="space-y-4">
                    <LocationAutocomplete
                      value={streetAddress}
                      onChange={setStreetAddress}
                      onPlaceSelected={handlePlaceSelected}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
                    />
                    <input
                      type="text"
                      value={unitFlat}
                      onChange={(e) => setUnitFlat(e.target.value)}
                      placeholder="Unit or Flat #"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
                    />

                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={handleLocationContinue}
                        disabled={loading || !streetAddress.trim()}
                        className="bg-brand-terracotta hover:bg-brand-coral text-white px-8 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Saving...' : 'Continue'}
                      </Button>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Confirmed Mode - Show confirmed location
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-brand-dark font-semibold text-lg mb-2">
                        Your task location
                      </h2>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 text-sm">{streetAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-brand-terracotta text-sm">
                    Good news! Taskrabbit is available in your area
                  </p>
                </>
              )}
            </div>

            {/* Dynamic Task Form */}
            {locationConfirmed && category && (
              <DynamicFormRenderer
                categoryId={category.id}
                categoryName={category.name}
                initialValues={formResponses}
                onSubmit={handleFormSubmit}
                submitButtonText={loading ? 'Loading...' : 'See Taskers & Prices'}
              />
            )}

            {/* Error Message */}
            {error && locationConfirmed && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Browse Pros Section */
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="w-80 flex-shrink-0 space-y-6">
              <BrowseFilters onFilterChange={handleFilterChange} />
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
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
                    <p className="mt-4 text-gray-600">Loading handymen...</p>
                  </div>
                ) : filteredHandymen.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-8">
                    <p className="text-gray-600 text-lg mb-2">No handymen available for this category</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  filteredHandymen.map((handyman) => (
                    <TaskerCard
                      key={handyman.user_id}
                      handyman={handyman}
                      categoryName={category?.name || ''}
                      onSelectContinue={(date, time) => {
                        handleSelectHandyman(handyman, date, time);
                      }}
                    />
                  ))
                )}
              </div>
            </main>
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TaskFormPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <TaskFormContent />
    </Suspense>
  );
}
