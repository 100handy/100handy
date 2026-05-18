"use client";

import { useState, useEffect, useCallback, useMemo, Suspense, useRef, type TouchEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
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
import { findOrCreateAddress } from "@/lib/supabase/addresses";
import { createBooking, getEstimatedHours, MINIMUM_BOOKING_HOURS } from "@/lib/supabase/bookings";
import { createPaymentIntent, cancelPaymentIntent } from "@/lib/stripe/payment";
import { createClient } from "@/lib/supabase";
import type { FormResponse } from "@shared/supabase";
import { usePendingBookingStore, useLocationStore, type PendingBookingData } from '@shared/store';
import { useCategoriesByNames, useHandymenByCategory, useAvailabilityByUserIds, type Category, type HandymanProfile, type AvailabilitySlot } from '@shared/query';

// Sort options type
type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'reviews';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_low', label: 'Price (Lowest)' },
  { value: 'price_high', label: 'Price (Highest)' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Reviews' },
];

// Time ranges for filtering
const TIME_RANGES: Record<string, { start: string; end: string }> = {
  morning: { start: '08:00:00', end: '12:00:00' },
  afternoon: { start: '12:00:00', end: '17:00:00' },
  evening: { start: '17:00:00', end: '21:30:00' },
};

function TaskFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");
  const stepFromUrl = searchParams.get("step");

  // Pending booking store for saving booking before auth
  const { getPendingBooking, setPendingBooking, clearPendingBooking } = usePendingBookingStore();
  const { setLocation } = useLocationStore();

  // Fetch category using shared hook
  const categoryNames = useMemo(() => categoryFromUrl ? [categoryFromUrl] : [], [categoryFromUrl]);
  const { data: categoriesData, isLoading: categoryLoading, error: categoryError } = useCategoriesByNames(categoryNames);

  // Derive category from hook data
  const category = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return null;
    return categoriesData[0] as Category;
  }, [categoriesData]);

  const taskCategory = category?.name || categoryFromUrl || "";
  const normalizedTaskCategory = taskCategory.trim().toLowerCase();

  // Track if pending booking was restored
  const [pendingBookingRestored, setPendingBookingRestored] = useState(false);

  // Task details state
  const [streetAddress, setStreetAddress] = useState("");
  const [unitFlat, setUnitFlat] = useState("");
  const [googlePlaceData, setGooglePlaceData] = useState<any>(null);
  const [formResponses, setFormResponses] = useState<FormResponse>({});

  // Flow state
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [taskOptionsCompleted, setTaskOptionsCompleted] = useState(false);
  const [showBrowsePros, setShowBrowsePros] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [sheetOffsetY, setSheetOffsetY] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const sheetDragStartYRef = useRef<number | null>(null);

  // Sort state
  const [selectedSort, setSelectedSort] = useState<SortOption>('recommended');

  useEffect(() => {
    const updateViewport = () => setIsMobileViewport(window.innerWidth < 640);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Fetch handymen using shared hook
  // Only fetch when we have a valid category ID and are showing browse pros
  const shouldFetchHandymen = !!category?.id && showBrowsePros;
  const {
    data: handymenData,
    isLoading: handymenLoading,
    isError: handymenError,
  } = useHandymenByCategory(shouldFetchHandymen ? category.id : '', {
    sortBy: selectedSort,
  });

  // Derive handymen from hook data
  const handymen = handymenData || [];

  // Fetch availability for all handymen in a single query (batch)
  const handymenUserIds = useMemo(() => handymen.map(h => h.user_id), [handymen]);
  const {
    data: availabilityCache,
    isLoading: isLoadingAvailability,
  } = useAvailabilityByUserIds(handymenUserIds);

  // Track applied filters to derive filtered handymen
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);

  // Derive filtered handymen using useMemo (no useEffect needed)
  const filteredHandymen = useMemo(() => {
    if (!handymen.length) return [];
    if (!appliedFilters) return handymen;

    // Use empty object if availability data is still loading
    const availability = availabilityCache || {};

    const candidateDays = new Set<number>();
    if (appliedFilters.selectedDate === 'custom' && appliedFilters.customDateRange) {
      const { start, end } = appliedFilters.customDateRange;
      const current = new Date(start);
      while (current <= end) {
        candidateDays.add(current.getDay());
        current.setDate(current.getDate() + 1);
      }
    } else if (appliedFilters.selectedDate && appliedFilters.selectedDate !== 'custom') {
      const today = new Date();
      const daysAhead: Record<string, number> = {
        today: 0,
        '3days': 3,
        week: 7,
      };
      const maxDays = daysAhead[appliedFilters.selectedDate] ?? 7;

      for (let i = 0; i <= maxDays; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        candidateDays.add(d.getDay()); // 0-6 (Sunday-Saturday)
      }
    }

    let filtered = [...handymen];

    // Filter by price range (convert to pounds for comparison)
    filtered = filtered.filter(handyman => {
      const hourlyRate = handyman.hourly_rate_cents / 100;
      return hourlyRate >= appliedFilters.priceMin && hourlyRate <= appliedFilters.priceMax;
    });

    // Filter by elite status (verified)
    if (appliedFilters.isEliteTasker) {
      filtered = filtered.filter(handyman => handyman.verified);
    }

    // Filter by date window (today/3days/week/custom)
    if (candidateDays.size > 0) {
      filtered = filtered.filter(handyman => {
        const slots = availability[handyman.user_id] || [];
        if (slots.length === 0) return true; // No availability set = available anytime
        return slots.some(slot => slot.is_active && candidateDays.has(slot.day_of_week));
      });
    }

    // Filter by exact time (or "I'm flexible")
    if (appliedFilters.specificTime) {
      const specificTime = `${appliedFilters.specificTime}:00`; // HH:MM:SS
      filtered = filtered.filter(handyman => {
        const slots = availability[handyman.user_id] || [];
        if (slots.length === 0) return true; // No availability set = available anytime

        return slots.some(slot => {
          if (!slot.is_active) return false;
          if (candidateDays.size > 0 && !candidateDays.has(slot.day_of_week)) return false;
          // Inclusive start, exclusive end
          return slot.start_time <= specificTime && slot.end_time > specificTime;
        });
      });
    }

    // Filter by time of day
    if (!appliedFilters.specificTime && appliedFilters.selectedTimes && appliedFilters.selectedTimes.length > 0) {
      filtered = filtered.filter(handyman => {
        const slots = availability[handyman.user_id] || [];
        if (slots.length === 0) return true; // No availability set = available anytime

        return appliedFilters.selectedTimes.some(timeSlot => {
          const range = TIME_RANGES[timeSlot];
          if (!range) return false;
          return slots.some(slot => {
            if (!slot.is_active) return false;
            // Check if slot overlaps with selected time range
            return slot.start_time < range.end && slot.end_time > range.start;
          });
        });
      });
    }

    return filtered;
  }, [handymen, appliedFilters, availabilityCache]);

  // Data state
  const [selectedHandyman, setSelectedHandyman] = useState<HandymanProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [addressId, setAddressId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment state
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);


  // Restore state from sessionStorage when step >= 2 (on page refresh)
  useEffect(() => {
    const step = parseInt(stepFromUrl || "1", 10);
    if (step >= 2) {
      const savedLocation = sessionStorage.getItem('taskForm_location');
      const savedResponses = sessionStorage.getItem('taskForm_responses');

      if (savedLocation) {
        try {
          const loc = JSON.parse(savedLocation);
          setStreetAddress(loc.streetAddress || "");
          setUnitFlat(loc.unitNumber || ""); // Read unitNumber for consistency with Zustand store
          setGooglePlaceData(loc.googlePlaceData);
          if (loc.addressId) setAddressId(loc.addressId);
        } catch (e) {
          console.error('Failed to parse saved location:', e);
        }
      }

      if (savedResponses) {
        try {
          setFormResponses(JSON.parse(savedResponses));
        } catch (e) {
          console.error('Failed to parse saved responses:', e);
        }
      }

      setLocationConfirmed(true);
      setTaskOptionsCompleted(true);
      if (step === 2) setShowBrowsePros(true);
      if (step === 3) setShowConfirmation(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Check authentication - but don't redirect, just track auth state
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Restore pending booking when authenticated user returns
  useEffect(() => {
    if (!isAuthenticated || pendingBookingRestored) return;

    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      // Restore location
      setStreetAddress(pendingBooking.location.formattedAddress || pendingBooking.location.streetAddress);
      setUnitFlat(pendingBooking.location.unitNumber || '');
      setLocation(pendingBooking.location);

      // Restore form responses
      setFormResponses(pendingBooking.formResponses);

      // Mark as restored and proceed to browse pros
      setLocationConfirmed(true);
      setTaskOptionsCompleted(true);
      setPendingBookingRestored(true);

      // Clear the pending booking after restoring
      clearPendingBooking();
    }
  }, [isAuthenticated, pendingBookingRestored, getPendingBooking, setLocation, clearPendingBooking]);

  // Handle category loading errors
  useEffect(() => {
    if (!categoryFromUrl) {
      setError('No category specified. Please select a service category.');
    } else if (categoryError) {
      setError('Failed to load category. Please try again or select a different service.');
    } else if (!categoryLoading && categoriesData && categoriesData.length === 0 && categoryFromUrl) {
      setError(`Category "${categoryFromUrl}" not found. Please select a valid service from the homepage.`);
    } else if (category) {
      setError(null); // Clear any previous errors when category is loaded
    }
  }, [categoryFromUrl, categoryError, categoryLoading, categoriesData, category]);

  // Auto-proceed to browse pros when pending booking is restored and category is loaded
  useEffect(() => {
    if (pendingBookingRestored && category && taskOptionsCompleted && !showBrowsePros) {
      handleBrowsePros();
    }
  }, [pendingBookingRestored, category, taskOptionsCompleted, showBrowsePros]);

  // Save location to sessionStorage when confirmed
  useEffect(() => {
    if (locationConfirmed && streetAddress) {
      sessionStorage.setItem('taskForm_location', JSON.stringify({
        streetAddress,
        unitNumber: unitFlat, // Use unitNumber for consistency with Zustand store
        googlePlaceData,
        addressId,
      }));
    }
  }, [locationConfirmed, streetAddress, unitFlat, googlePlaceData, addressId]);

  // Save form responses to sessionStorage when completed
  useEffect(() => {
    if (taskOptionsCompleted && Object.keys(formResponses).length > 0) {
      sessionStorage.setItem('taskForm_responses', JSON.stringify(formResponses));
    }
  }, [taskOptionsCompleted, formResponses]);

  // Update URL when step changes (without page reload)
  useEffect(() => {
    const currentStep = getCurrentStep();
    const params = new URLSearchParams(searchParams.toString());
    const existingStep = params.get("step");

    if (existingStep !== currentStep.toString()) {
      params.set("step", currentStep.toString());
      router.replace(`/task-form?${params.toString()}`, { scroll: false });
    }
  }, [showBrowsePros, showConfirmation, searchParams, router]);

  const handleLocationContinue = async () => {
    if (!streetAddress.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // If user is authenticated, create/find address in database
      if (userId) {
        const address = await findOrCreateAddress(
          userId,
          googlePlaceData || { formatted_address: streetAddress },
          unitFlat
        );

        if (address) {
          setAddressId(address.id);
        }
      }

      // Store location in Zustand for later use (even if not authenticated)
      setLocation({
        streetAddress: streetAddress,
        unitNumber: unitFlat || undefined,
        city: googlePlaceData?.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '',
        country: googlePlaceData?.address_components?.find((c: any) => c.types.includes('country'))?.long_name || 'UK',
        postalCode: googlePlaceData?.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || '',
        formattedAddress: googlePlaceData?.formatted_address || streetAddress,
        placeId: googlePlaceData?.place_id,
      });

      setLocationConfirmed(true);
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

  const handleBrowsePros = () => {
    if (!category) {
      setError('Cannot load handymen: Missing category');
      return;
    }

    // Clear any previous errors and show browse pros
    // The useHandymenByCategory hook will automatically fetch when showBrowsePros becomes true
    setError(null);
    setShowBrowsePros(true);
  };

  // Save pending booking and redirect to sign-in
  const savePendingBookingAndRedirect = (handyman: HandymanProfile, date: string, time: string) => {
    const pendingBookingData: PendingBookingData = {
      categoryId: category?.id || '',
      categoryName: category?.name || taskCategory,
      tasker: {
        id: handyman.user_id,
        userId: handyman.user_id,
        displayName: handyman.display_name || `${handyman.first_name} ${handyman.last_name?.charAt(0)}.`,
        avatarUrl: handyman.avatar_url,
        hourlyRateCents: handyman.hourly_rate_cents,
        verified: handyman.verified || false,
        rating: handyman.rating,
      },
      selectedDate: date,
      selectedTime: time,
      location: {
        streetAddress: streetAddress,
        unitNumber: unitFlat || undefined,
        city: googlePlaceData?.address_components?.find((c: any) => c.types.includes('locality'))?.long_name || '',
        country: googlePlaceData?.address_components?.find((c: any) => c.types.includes('country'))?.long_name || 'UK',
        postalCode: googlePlaceData?.address_components?.find((c: any) => c.types.includes('postal_code'))?.long_name || '',
        formattedAddress: googlePlaceData?.formatted_address || streetAddress,
        placeId: googlePlaceData?.place_id,
      },
      formResponses,
      createdAt: Date.now(),
      returnPath: `/task-form?category=${encodeURIComponent(category?.name || taskCategory)}`,
    };

    setPendingBooking(pendingBookingData);

    // Redirect to sign-in page with return URL
    router.push(`/sign-in?redirect=${encodeURIComponent(`/task-form?category=${encodeURIComponent(category?.name || taskCategory)}`)}`);
  };

  const handleSelectHandyman = async (handyman: HandymanProfile, date: string, time: string) => {
    // If not authenticated, save pending booking and redirect to sign-in
    if (!isAuthenticated || !userId) {
      savePendingBookingAndRedirect(handyman, date, time);
      return;
    }

    setSelectedHandyman(handyman);
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBrowsePros(false);
    setShowConfirmation(true);
    setPaymentAuthorized(false);

    try {
      setLoading(true);
      setError(null);

      // Calculate the amount for authorization hold
      const taskSize = formResponses.task_size as string | undefined;
      const estimatedHours = getEstimatedHours(taskSize);
      const holdHours = Math.max(MINIMUM_BOOKING_HOURS, estimatedHours);
      const amount = handyman.hourly_rate_cents * holdHours;

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
    // Store filters - filteredHandymen is derived via useMemo
    setAppliedFilters(filters);
  }, []);

  const handlePaymentSuccess = async (authorizedPaymentIntentId: string) => {
    // Track that payment has been authorized to avoid re-confirming with Stripe on retry
    setPaymentAuthorized(true);

    // Payment authorization successful! Now create the booking
    if (!userId || !selectedHandyman || !category || !addressId) {
      // Release the authorization hold since we can't create the booking
      try {
        await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
      } catch (releaseErr) {
        console.error('Failed to release payment hold:', releaseErr);
      }
      setPaymentAuthorized(false);
      setError('Missing required booking information. Your payment hold has been released.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const estimatedHours = getEstimatedHours(formResponses.task_size as string | undefined);

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
        // Clear sessionStorage on successful booking
        sessionStorage.removeItem('taskForm_location');
        sessionStorage.removeItem('taskForm_responses');

        // Navigate to booking confirmation page
        router.push(`/bookings/${booking.id}`);
      } else {
        // Release the authorization hold since booking was not created
        try {
          await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
        } catch (releaseErr) {
          console.error('Failed to release payment hold:', releaseErr);
        }
        setPaymentAuthorized(false);
        setError('Failed to create booking. Your payment hold has been released. Please try again.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      // Release the authorization hold since booking failed
      try {
        await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
      } catch (releaseErr) {
        console.error('Failed to release payment hold:', releaseErr);
      }
      setPaymentAuthorized(false);
      setError('Failed to create booking. Your payment hold has been released. Please try again.');
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
    setShowBrowsePros(false);
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
    { number: 1, label: "Describe your task", mobileLabel: "Describe", active: getCurrentStep() === 1 },
    { number: 2, label: "Browse Pros", mobileLabel: "Browse", active: getCurrentStep() === 2 },
    { number: 3, label: "Confirm details", mobileLabel: "Confirm", active: getCurrentStep() === 3 },
  ];

  const enableMobilePullDownDismiss =
    isMobileViewport &&
    normalizedTaskCategory === "tv mounting" &&
    !showBrowsePros &&
    !showConfirmation;

  const dismissTaskForm = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }, [router]);

  const handleSheetTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!enableMobilePullDownDismiss) return;
    sheetDragStartYRef.current = event.touches[0]?.clientY ?? null;
    setIsSheetDragging(true);
  }, [enableMobilePullDownDismiss]);

  const handleSheetTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!enableMobilePullDownDismiss || sheetDragStartYRef.current === null) return;

    const currentY = event.touches[0]?.clientY ?? sheetDragStartYRef.current;
    const deltaY = Math.max(0, currentY - sheetDragStartYRef.current);
    setSheetOffsetY(Math.min(deltaY, 240));
  }, [enableMobilePullDownDismiss]);

  const handleSheetTouchEnd = useCallback(() => {
    if (!enableMobilePullDownDismiss) return;

    setIsSheetDragging(false);
    sheetDragStartYRef.current = null;

    if (sheetOffsetY > 120) {
      dismissTaskForm();
      return;
    }

    setSheetOffsetY(0);
  }, [dismissTaskForm, enableMobilePullDownDismiss, sheetOffsetY]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Progress Stepper */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Progress Stepper */}
            <div className="flex items-center gap-1 sm:gap-2 flex-1 max-w-2xl mx-2 sm:mx-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1 min-w-0">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${
                        step.active
                          ? "bg-brand-terracotta text-white"
                          : "bg-gray-300 text-white"
                      }`}
                    >
                      {step.number}
                    </div>
                    {step.label && (
                      <>
                        <span className="text-[11px] leading-tight text-brand-dark text-center sm:hidden">
                          {step.mobileLabel}
                        </span>
                        <span className="hidden sm:inline text-xs text-brand-dark whitespace-nowrap">
                        {step.label}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mx-1 sm:mx-2" />
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
                    Tell us about your task. We use these details to show 100 Handy Pros in your area
                  </p>
                  <p className="text-brand-dark text-sm">Who fit your needs.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 ${enableMobilePullDownDismiss ? "py-0 sm:py-8 bg-[#EFE6DB]" : "py-8"}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          {showConfirmation ? (
            /* Confirmation Step */
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Left Column - Payment Form */}
              <ConfirmDetails
                clientSecret={paymentIntentClientSecret}
                authorizedPaymentId={paymentAuthorized ? paymentIntentId : undefined}
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
            <div
              className={`max-w-3xl mx-auto space-y-6 ${enableMobilePullDownDismiss ? "sm:space-y-6 space-y-0" : ""}`}
              style={
                enableMobilePullDownDismiss
                  ? {
                      transform: `translateY(${sheetOffsetY}px)`,
                      transition: isSheetDragging ? "none" : "transform 220ms ease-out",
                    }
                  : undefined
              }
            >
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

              <div
                className={
                  enableMobilePullDownDismiss
                    ? "min-h-[calc(100vh-176px)] bg-white rounded-t-[32px] border border-[#E6DED4] border-b-0 px-4 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
                    : ""
                }
              >
                {enableMobilePullDownDismiss && (
                  <div
                    className="flex flex-col items-center gap-2 pb-4"
                    onTouchStart={handleSheetTouchStart}
                    onTouchMove={handleSheetTouchMove}
                    onTouchEnd={handleSheetTouchEnd}
                    onTouchCancel={handleSheetTouchEnd}
                  >
                    <div className="h-1.5 w-12 rounded-full bg-gray-300" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400">
                      Pull down to close
                    </span>
                  </div>
                )}

                {/* Task Title */}
                <h1 className="text-brand-dark font-bold text-2xl sm:text-3xl">
                  {taskCategory || 'Select a Service'}
                </h1>

            {/* Your task location */}
            <div className={`rounded-lg border p-6 mt-6 ${enableMobilePullDownDismiss ? "bg-[#FAF8F4] border-[#E6DED4]" : "bg-white border-gray-300"}`}>
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
                    Good news! 100 Handy is available in your area
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
                submitButtonText={loading ? 'Loading...' : 'See 100 Handy Pros & Prices'}
              />
            )}

            {/* Error Message */}
            {error && locationConfirmed && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            </div>
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
                  <h1 className="text-2xl font-medium text-brand-dark-alt">
                    Browse Pros & Prices
                  </h1>
                  <p className="text-brand-dark-alt text-base leading-relaxed mt-1">
                    Filter and sort to find your 100Handy Pro. Then view their
                    availability to request your date and time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sorted by:
                  </span>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {handymenLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
                    <p className="mt-4 text-gray-600">Loading handymen...</p>
                  </div>
                ) : handymenError ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-8">
                    <p className="text-gray-600 text-lg mb-2">Failed to load handymen</p>
                    <p className="text-gray-500 text-sm">Please try again later</p>
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
                      availability={availabilityCache?.[handyman.user_id]}
                      isAvailabilityLoading={isLoadingAvailability}
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
