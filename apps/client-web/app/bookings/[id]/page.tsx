"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import { getBooking, cancelBooking, type Booking } from "@/lib/supabase/bookings";
import { createClient } from "@/lib/supabase";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoadBooking = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/sign-in');
        return;
      }

      setUserId(user.id);

      try {
        setLoading(true);
        const bookingData = await getBooking(bookingId);

        if (!bookingData) {
          setError('Booking not found');
          return;
        }

        // Verify the booking belongs to the user
        if (bookingData.customer_id !== user.id) {
          setError('You do not have permission to view this booking');
          return;
        }

        setBooking(bookingData);
      } catch (err) {
        console.error('Error loading booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadBooking();
  }, [bookingId, router]);

  const handleCancelBooking = async () => {
    if (!booking || !confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setIsCancelling(true);
      const success = await cancelBooking(booking.id);

      if (success) {
        // Refresh booking data
        const updatedBooking = await getBooking(booking.id);
        setBooking(updatedBooking);
      } else {
        setError('Failed to cancel booking. Please try again.');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return 'Not scheduled';
    const [hours, minutes] = timeStr.split(':');
    if (!hours || !minutes) return 'Not scheduled';
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'authorized':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'captured':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="flex items-center h-[70px]">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                  100<span className="font-normal">HANDY</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-terracotta"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            <div className="flex items-center h-[70px]">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                  100<span className="font-normal">HANDY</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="max-w-[800px] mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Booking Not Found'}
              </h1>
              <p className="text-gray-600 mb-6">
                We couldn't find the booking you're looking for.
              </p>
              <Link
                href="/"
                className="inline-block bg-brand-terracotta hover:bg-brand-coral text-white px-6 py-3 rounded-lg font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                100<span className="font-normal">HANDY</span>
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="text-brand-dark hover:text-brand-terracotta transition-colors"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      {booking.status === 'pending' && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-900 mb-1">
                  Booking Confirmed!
                </h2>
                <p className="text-green-800">
                  Your payment has been authorized and your booking request has been sent to the handyman.
                  You'll be notified when they accept the job.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8">
          <div className="space-y-6">
            {/* Booking Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-brand-dark mb-2">
                    {booking.task_title}
                  </h1>
                  <p className="text-gray-600">Booking #{booking.id}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.payment_status)}`}>
                    {booking.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Handyman Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">HANDYMAN</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {booking.handy_name?.charAt(0) || 'H'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">{booking.handy_name}</p>
                    <p className="text-sm text-gray-600">
                      £{(booking.hourly_rate_cents / 100).toFixed(2)}/hr
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">SCHEDULE</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-dark">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(booking.scheduled_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-dark">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(booking.scheduled_time)}</span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">LOCATION</h3>
                <div className="flex items-start gap-2 text-brand-dark">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>{booking.address?.street}</p>
                    {booking.address?.apartment && <p>{booking.address.apartment}</p>}
                    <p>{booking.address?.city}, {booking.address?.postcode}</p>
                  </div>
                </div>
              </div>

              {/* Task Details */}
              {booking.task_details && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">TASK DETAILS</h3>
                  <p className="text-brand-dark whitespace-pre-wrap">{booking.task_details}</p>
                </div>
              )}

              {/* Pricing Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">PRICING</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-brand-dark">
                    <span>Hourly Rate:</span>
                    <span className="font-medium">£{(booking.hourly_rate_cents / 100).toFixed(2)}/hr</span>
                  </div>
                  <div className="flex justify-between text-brand-dark">
                    <span>Estimated Hours:</span>
                    <span className="font-medium">{booking.estimated_hours}h</span>
                  </div>
                  <div className="flex justify-between text-brand-dark font-medium pt-2 border-t border-gray-200">
                    <span>Estimated Total:</span>
                    <span>£{((booking.hourly_rate_cents * booking.estimated_hours) / 100).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * You will only be charged when the task is marked as complete. Final amount may vary based on actual time worked.
                </p>
              </div>
            </div>

            {/* Payment Info Card */}
            {booking.payment_status === 'authorized' && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Payment Authorized</h3>
                    <p className="text-sm text-blue-800">
                      Your payment method has been authorized but not charged. You'll only be charged when the handyman marks the task as complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="flex gap-4">
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="flex-1 bg-white border border-red-300 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            )}

            {/* Next Steps */}
            {booking.status === 'pending' && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium text-brand-dark mb-3">What happens next?</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>The handyman will review your booking request</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>You'll receive a notification when they accept</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>You can message them to discuss any details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">4.</span>
                    <span>They'll arrive at the scheduled time to complete your task</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
