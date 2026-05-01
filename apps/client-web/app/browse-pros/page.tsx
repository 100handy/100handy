"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  TaskerCard,
  BrowseFilters,
  PeaceOfMindCard,
  StepIndicator,
} from "@/components/browse-pros";
import type { FilterValues } from "@/components/browse-pros/browse-filters";
import { ConfirmDetails } from "@/components/confirm-booking/confirm-details";
import { TaskSummary } from "@/components/confirm-booking/task-summary";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { useAuthContext } from "@/components/providers/auth-provider";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/marketing/footer";
import { usePendingBookingStore, useLocationStore, type PendingBookingData } from '@shared/store'; import { useCategoriesByNames, useHandymenByCategory, useAvailabilityByUserIds, type HandymanProfile } from '@shared/query';
import { createClient } from "@/lib/supabase";
import { createAddress } from "@/lib/supabase/addresses";
import { createBooking } from "@/lib/supabase/bookings";
import { cancelPaymentIntent, createPaymentIntent } from "@/lib/stripe/payment";
import type { FormResponse } from "@shared/supabase";

type SortOption = "recommended" | "price_low" | "price_high" | "rating" | "reviews";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_low", label: "Price (Lowest)" },
  { value: "price_high", label: "Price (Highest)" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Reviews" },
];

const TIME_RANGES: Record<string, { start: string; end: string }> = {
  morning: { start: "08:00:00", end: "12:00:00" },
  afternoon: { start: "12:00:00", end: "17:00:00" },
  evening: { start: "17:00:00", end: "21:30:00" },
};

function formatDateDisplay(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTimeDisplay(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const hour = hours ?? 0;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minutes ?? 0).padStart(2, "0")} ${ampm}`;
}

function BrowseProsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { setPendingBooking, getPendingBooking, clearPendingBooking } =
    usePendingBookingStore();
  const { location, setLocation } = useLocationStore();

  const categoryNameFromUrl = searchParams.get("categoryName") || "Handyman";
  const categoryIdFromUrl = searchParams.get("categoryId");

  const { data: categoriesData } = useCategoriesByNames(
    useMemo(() => [categoryNameFromUrl], [categoryNameFromUrl])
  );
  const category = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return null;
    return categoriesData[0] as { id: string; name: string };
  }, [categoriesData]);

  const categoryId = categoryIdFromUrl || category?.id || "";
  const categoryName = category?.name || categoryNameFromUrl;

  const [selectedSort, setSelectedSort] = useState<SortOption>("recommended");
  const [appliedFilters, setAppliedFilters] = useState<FilterValues | null>(null);

  const {
    data: handymenData,
    isLoading: handymenLoading,
    isError: handymenError,
  } = useHandymenByCategory(categoryId, { sortBy: selectedSort });

  const handymen = handymenData || [];
  const handymenUserIds = useMemo(
    () => handymen.map((h) => h.user_id),
    [handymen]
  );
  const { data: availabilityCache, isLoading: isLoadingAvailability } =
    useAvailabilityByUserIds(handymenUserIds);

  const filteredHandymen = useMemo(() => {
    if (!handymen.length) return handymen;
    if (!appliedFilters) return handymen;

    const availability = availabilityCache || {};
    const candidateDays = new Set<number>();

    if (
      appliedFilters.selectedDate === "custom" &&
      appliedFilters.customDateRange
    ) {
      const { start, end } = appliedFilters.customDateRange;
      const current = new Date(start);
      while (current <= end) {
        candidateDays.add(current.getDay());
        current.setDate(current.getDate() + 1);
      }
    } else if (
      appliedFilters.selectedDate &&
      appliedFilters.selectedDate !== "custom"
    ) {
      const today = new Date();
      const daysAhead: Record<string, number> = {
        today: 0,
        "3days": 3,
        week: 7,
      };
      const maxDays = daysAhead[appliedFilters.selectedDate] ?? 7;
      for (let i = 0; i <= maxDays; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        candidateDays.add(d.getDay());
      }
    }

    let filtered = handymen.filter((h) => {
      const rate = h.hourly_rate_cents / 100;
      return rate >= appliedFilters.priceMin && rate <= appliedFilters.priceMax;
    });

    if (appliedFilters.isEliteTasker) {
      filtered = filtered.filter((h) => h.verified);
    }

    if (candidateDays.size > 0) {
      filtered = filtered.filter((h) => {
        const slots = availability[h.user_id] || [];
        if (slots.length === 0) return true;
        return slots.some(
          (s) => s.is_active && candidateDays.has(s.day_of_week)
        );
      });
    }

    if (appliedFilters.specificTime) {
      const t = `${appliedFilters.specificTime}:00`;
      filtered = filtered.filter((h) => {
        const slots = availability[h.user_id] || [];
        if (slots.length === 0) return true;
        return slots.some(
          (s) =>
            s.is_active &&
            s.start_time <= t &&
            s.end_time > t &&
            (candidateDays.size === 0 || candidateDays.has(s.day_of_week))
        );
      });
    }

    if (
      !appliedFilters.specificTime &&
      appliedFilters.selectedTimes?.length > 0
    ) {
      filtered = filtered.filter((h) => {
        const slots = availability[h.user_id] || [];
        if (slots.length === 0) return true;
        return appliedFilters.selectedTimes.some((ts) => {
          const range = TIME_RANGES[ts];
          if (!range) return false;
          return slots.some(
            (s) =>
              s.is_active &&
              s.start_time < range.end &&
              s.end_time > range.start
          );
        });
      });
    }

    return filtered;
  }, [handymen, appliedFilters, availabilityCache]);

  const [currentStep, setCurrentStep] = useState(2);
  const [selectedTasker, setSelectedTasker] = useState<HandymanProfile | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState("");
  const [unitFlat, setUnitFlat] = useState("");
  const [googlePlaceData, setGooglePlaceData] = useState<google.maps.places.PlaceResult | null>(null);
  const [addressId, setAddressId] = useState<string>("");
  const [formResponses, setFormResponses] = useState<FormResponse>({});
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] =
    useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    const pending = getPendingBooking();
    if (isAuthenticated && pending) {
      setLocation(pending.location);
      setStreetAddress(
        pending.location.formattedAddress || pending.location.streetAddress
      );
      setUnitFlat(pending.location.unitNumber || "");
      setLocationConfirmed(true);
      setFormResponses(pending.formResponses || {});
      const match = handymen.find((h) => h.user_id === pending.tasker.id);
      if (match) {
        setSelectedTasker(match);
        setSelectedDate(pending.selectedDate);
        setSelectedTime(pending.selectedTime);
        setCurrentStep(3);
        clearPendingBooking();
      }
    }
  }, [
    authLoading,
    isAuthenticated,
    getPendingBooking,
    setLocation,
    handymen,
    clearPendingBooking,
  ]);

  useEffect(() => {
    if (currentStep === 3 && location && location.streetAddress && !streetAddress) {
      setStreetAddress(location.formattedAddress || location.streetAddress);
      setUnitFlat(location.unitNumber || "");
      setLocationConfirmed(true);
    }
  }, [currentStep, location, streetAddress]);

  const handleFilterChange = useCallback((filters: FilterValues) => {
    setAppliedFilters(filters);
  }, []);

  const savePendingBookingAndRedirect = (
    tasker: HandymanProfile,
    date: string,
    time: string
  ) => {
    const loc = location || {
      streetAddress: "",
      city: "",
      country: "UK",
      postalCode: "",
    };
    const data: PendingBookingData = {
      categoryId,
      categoryName,
      tasker: {
        id: tasker.user_id,
        userId: tasker.user_id,
        displayName:
          tasker.display_name ||
          `${tasker.first_name} ${tasker.last_name?.charAt(0) || ""}.`,
        avatarUrl: tasker.avatar_url,
        hourlyRateCents: tasker.hourly_rate_cents,
        verified: tasker.verified || false,
        rating: tasker.rating,
      },
      selectedDate: date,
      selectedTime: time,
      location: loc,
      formResponses,
      createdAt: Date.now(),
      returnPath: `/browse-pros?categoryName=${encodeURIComponent(categoryName)}${categoryId ? `&categoryId=${categoryId}` : ""}`,
    };
    setPendingBooking(data);
    router.push(`/sign-up?redirect=${encodeURIComponent(`/browse-pros?categoryName=${encodeURIComponent(categoryName)}`)}`);
  };

  const handleSelectContinue = (
    tasker: HandymanProfile,
    date: string,
    time: string
  ) => {
    if (!isAuthenticated || !userId) {
      savePendingBookingAndRedirect(tasker, date, time);
      return;
    }

    setSelectedTasker(tasker);
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(3);
    setPaymentIntentClientSecret("");
    setPaymentIntentId("");
    setPaymentAuthorized(false);

    if (!location || !streetAddress.trim()) {
      setLocationConfirmed(false);
      setError(null);
    } else {
      setLocationConfirmed(true);
    }
  };

  const initPaymentRef = React.useRef(false);

  useEffect(() => {
    // Only trigger when all prerequisites are met and no payment already initiated
    if (
      currentStep !== 3 ||
      !selectedTasker ||
      !locationConfirmed ||
      !streetAddress ||
      !userId ||
      isPreparingPayment ||
      paymentIntentClientSecret ||
      initPaymentRef.current
    ) {
      return;
    }

    initPaymentRef.current = true;

    const initPayment = async () => {
      try {
        setIsPreparingPayment(true);
        setError(null);
        let addrId = addressId;
        if (!addrId) {
          const address = await createAddress({
            user_id: userId,
            street: streetAddress,
            apartment: unitFlat || undefined,
            postcode: location?.postalCode || "",
            city: location?.city || "",
            country: location?.country || "UK",
            is_primary: true,
          });
          if (address) {
            setAddressId(address.id);
            addrId = address.id;
          }
        }
        if (!addrId) throw new Error("Address required");

        const taskSize = formResponses.task_size as string | undefined;
        const estimatedHours =
          taskSize === "small" ? 1 : taskSize === "large" ? 4 : 2.5;
        const amount = Math.round(
          selectedTasker.hourly_rate_cents * estimatedHours
        );
        const payment = await createPaymentIntent({
          amount,
          currency: "gbp",
          metadata: {
            handyman_id: selectedTasker.user_id,
            category_id: categoryId,
            estimated_hours: String(estimatedHours),
          },
        });
        if (payment) {
          setPaymentIntentClientSecret(payment.clientSecret);
          setPaymentIntentId(payment.paymentIntentId);
        }
      } catch (err) {
        console.error(err);
        initPaymentRef.current = false;
        setError("Failed to initialize payment.");
      } finally {
        setIsPreparingPayment(false);
      }
    };
    initPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedTasker, locationConfirmed, userId, paymentIntentClientSecret]);

  const handleLocationContinue = async () => {
    if (!streetAddress.trim()) return;
    setLocation({
      streetAddress,
      unitNumber: unitFlat || undefined,
      city:
        googlePlaceData?.address_components?.find((c) =>
          c.types.includes("locality")
        )?.long_name || "",
      country:
        googlePlaceData?.address_components?.find((c) =>
          c.types.includes("country")
        )?.long_name || "UK",
      postalCode:
        googlePlaceData?.address_components?.find((c) =>
          c.types.includes("postal_code")
        )?.long_name || "",
      formattedAddress: googlePlaceData?.formatted_address || streetAddress,
      placeId: googlePlaceData?.place_id,
    });
    setLocationConfirmed(true);
    setError(null);
  };

  const handlePaymentSuccess = async (authorizedPaymentIntentId: string) => {
    // Track that payment has been authorized to avoid re-confirming with Stripe on retry
    setPaymentAuthorized(true);

    if (!userId || !selectedTasker || !categoryId || !addressId) {
      try {
        await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
      } catch (releaseErr) {
        console.error("Failed to release payment hold:", releaseErr);
      }
      setError("Missing required booking information");
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      const taskSize = formResponses.task_size as string | undefined;
      const estimatedHours =
        taskSize === "small" ? 1 : taskSize === "large" ? 4 : 2.5;

      const booking = await createBooking({
        customer_id: userId,
        handy_id: selectedTasker.user_id,
        category_id: categoryId,
        task_title: categoryName,
        task_details: (formResponses.additional_details as string) || undefined,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        address_id: addressId,
        hourly_rate_cents: selectedTasker.hourly_rate_cents,
        estimated_hours: estimatedHours,
        form_responses: formResponses,
        payment_intent_id: authorizedPaymentIntentId,
      });

      if (booking) {
        clearPendingBooking();
        router.push(`/bookings/${booking.id}`);
      } else {
        try {
          await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
        } catch (releaseErr) {
          console.error("Failed to release payment hold:", releaseErr);
        }
        setPaymentAuthorized(false);
        setError("Failed to create booking. Your payment hold has been released. Please try again.");
      }
    } catch (err) {
      console.error(err);
      try {
        await cancelPaymentIntent({ paymentIntentId: authorizedPaymentIntentId });
      } catch (releaseErr) {
        console.error("Failed to release payment hold:", releaseErr);
      }
      setPaymentAuthorized(false);
      setError("Failed to create booking. Your payment hold has been released. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToStep2 = () => {
    clearPendingBooking();
    setCurrentStep(2);
    setSelectedTasker(null);
    setSelectedDate("");
    setSelectedTime("");
    setPaymentIntentClientSecret("");
    setPaymentIntentId("");
    setPaymentAuthorized(false);
    setIsPreparingPayment(false);
    setError(null);
    initPaymentRef.current = false;
  };

  const handlePlaceSelected = useCallback(
    (place: google.maps.places.PlaceResult) => {
      setGooglePlaceData(place);
      if (place.formatted_address) setStreetAddress(place.formatted_address);
    },
    []
  );

  const displayHandymen = appliedFilters ? filteredHandymen : handymen;
  const hasLocation = location?.streetAddress || streetAddress;
  const needsLocation =
    currentStep === 3 &&
    isAuthenticated &&
    selectedTasker &&
    !locationConfirmed &&
    !hasLocation;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      <div className="bg-brand-cream/40">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <p className="text-brand-dark-alt text-sm">
            {currentStep === 2
              ? "Filter and sort to find your 100Handy Pro. Then view their availability to request your date and time."
              : "You're almost done! We just need a few more details to connect you with your Pro."}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {currentStep === 2 ? (
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
              <BrowseFilters onFilterChange={handleFilterChange} />
              <PeaceOfMindCard />
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-medium text-brand-dark-alt">
                    Browse Pros & Prices
                  </h1>
                  <p className="text-brand-dark-alt text-base mt-1">
                    Filter and sort to find your 100Handy Pro.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sorted by:
                  </span>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    value={selectedSort}
                    onChange={(e) =>
                      setSelectedSort(e.target.value as SortOption)
                    }
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {handymenLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta" />
                  <p className="mt-4 text-gray-600">Loading pros...</p>
                </div>
              ) : handymenError ? (
                <div className="text-center py-12 bg-white rounded-lg border p-8">
                  <p className="text-gray-600">Failed to load pros.</p>
                  <Link
                    href="/dashboard"
                    className="mt-4 inline-block text-brand-terracotta hover:underline"
                  >
                    Go to Book a Task
                  </Link>
                </div>
              ) : displayHandymen.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border p-8">
                  <p className="text-gray-600">
                    {appliedFilters
                      ? "No pros match your filters. Try adjusting your criteria."
                      : "No pros available for this category."}
                  </p>
                  {appliedFilters ? (
                    <button
                      onClick={() => setAppliedFilters(null)}
                      className="mt-4 inline-block text-brand-terracotta hover:underline"
                    >
                      Clear filters
                    </button>
                  ) : (
                    <Link
                      href="/task-form?category=Handyman"
                      className="mt-4 inline-block text-brand-terracotta hover:underline"
                    >
                      Try task form
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {displayHandymen.map((handyman) => (
                    <TaskerCard
                      key={handyman.user_id}
                      handyman={handyman}
                      categoryName={categoryName}
                      availability={availabilityCache?.[handyman.user_id]}
                      isAvailabilityLoading={isLoadingAvailability}
                      onSelectContinue={(date, time) =>
                        handleSelectContinue(handyman, date, time)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToStep2}
              className="mb-6 flex items-center gap-2 text-brand-dark-alt hover:text-brand-terracotta"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to 100 Handy Pros
            </button>

            {needsLocation ? (
              <div className="max-w-2xl space-y-4">
                <h2 className="text-xl font-semibold text-brand-dark-alt">
                  Enter your task location
                </h2>
                <LocationAutocomplete
                  value={streetAddress}
                  onChange={setStreetAddress}
                  onPlaceSelected={handlePlaceSelected}
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={unitFlat}
                  onChange={(e) => setUnitFlat(e.target.value)}
                  placeholder="Unit or Flat #"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleLocationContinue}
                  disabled={!streetAddress.trim()}
                  className="bg-brand-terracotta text-white px-6 py-2.5 rounded-full hover:bg-brand-terracotta/90 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                <ConfirmDetails
                  clientSecret={paymentIntentClientSecret}
                  authorizedPaymentId={paymentAuthorized ? paymentIntentId : undefined}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(msg) => setError(msg)}
                  isSubmitting={isSubmitting}
                />

                <TaskSummary
                  handymanName={
                    selectedTasker?.display_name ||
                    (selectedTasker
                      ? `${selectedTasker.first_name} ${selectedTasker.last_name?.charAt(0) || ""}.`
                      : "Pro")
                  }
                  handymanAvatar={selectedTasker?.avatar_url || "/images/tasker-placeholder.jpg"}
                  scheduledDate={formatDateDisplay(selectedDate)}
                  scheduledTime={formatTimeDisplay(selectedTime)}
                  address={
                    location?.formattedAddress ||
                    location?.streetAddress ||
                    streetAddress ||
                    "Address not set"
                  }
                  taskSize={(formResponses.task_size as string) || "medium"}
                  vehicleRequirement={
                    (formResponses.vehicle_requirement as string) || "not-needed"
                  }
                  taskDetails={
                    (formResponses.additional_details as string) || "No details"
                  }
                  hourlyRateCents={selectedTasker?.hourly_rate_cents || 0}
                />
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BrowseProsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta" />
        </div>
      }
    >
      <BrowseProsContent />
    </Suspense>
  );
}
