"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePendingBookingStore, useLocationStore } from "@shared/supabase";
import { useAuthContext } from "@/components/providers/auth-provider";

export function PendingBookingBanner() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { getPendingBooking, clearPendingBooking } = usePendingBookingStore();
  const { setLocation } = useLocationStore();
  const [hasPendingBooking, setHasPendingBooking] = useState(false);
  const [pendingBookingDetails, setPendingBookingDetails] = useState<{
    categoryName: string;
    taskerName: string;
  } | null>(null);

  // Check for pending booking on mount
  useEffect(() => {
    if (authLoading) return;

    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      setHasPendingBooking(true);
      setPendingBookingDetails({
        categoryName: pendingBooking.categoryName,
        taskerName: pendingBooking.tasker.displayName,
      });

      // If authenticated, auto-redirect to continue booking
      if (isAuthenticated) {
        // Restore location and navigate
        setLocation(pendingBooking.location);
        router.push('/browse-pros');
      }
    }
  }, [authLoading, isAuthenticated, getPendingBooking, setLocation, router]);

  const handleContinueBooking = () => {
    const pendingBooking = getPendingBooking();
    if (pendingBooking) {
      setLocation(pendingBooking.location);
      // Navigate to sign-in if not authenticated, or browse-pros if authenticated
      if (isAuthenticated) {
        router.push('/browse-pros');
      } else {
        router.push('/sign-in?redirect=/browse-pros');
      }
    }
  };

  const handleDismiss = () => {
    clearPendingBooking();
    setHasPendingBooking(false);
    setPendingBookingDetails(null);
  };

  // Don't show if no pending booking or if user is authenticated (auto-redirects)
  if (!hasPendingBooking || isAuthenticated || authLoading) {
    return null;
  }

  return (
    <div className="bg-brand-terracotta/10 border-b border-brand-terracotta/20">
      <div className="mx-auto max-w-[1920px] px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-brand-terracotta"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-[#30352D]">
              <span className="font-medium">You have an unfinished booking!</span>
              {pendingBookingDetails && (
                <span className="ml-1">
                  {pendingBookingDetails.categoryName} with {pendingBookingDetails.taskerName}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleContinueBooking}
              className="rounded-full bg-brand-terracotta px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90"
            >
              Continue Booking
            </button>
            <button
              onClick={handleDismiss}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
