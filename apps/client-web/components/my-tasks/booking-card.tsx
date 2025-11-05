"use client";

import Link from "next/link";
import Image from "next/image";
import type { Booking } from "@/lib/supabase/bookings";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Scheduled';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'accepted':
        return 'text-blue-600';
      case 'in_progress':
        return 'text-orange-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="block"
    >
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Task Title */}
        <h3 className="text-[#C1856A] font-medium text-lg mb-4">
          {booking.task_title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">
            {formatDate(booking.scheduled_date, booking.scheduled_time)}
          </span>
        </div>

        {/* Handyman Info */}
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm">
            {booking.handy_name || 'Handyman'} ★ {booking.rating?.toFixed(1) || 'N/A'}
            {booking.jobs_completed > 0 && ` (${booking.jobs_completed} reviews)`}
          </span>
        </div>

        {/* Location */}
        {booking.address && (
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              {booking.address.city && `${booking.address.city}, `}{booking.address.postcode}
            </span>
          </div>
        )}

        {/* Price & Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-semibold text-lg">
            £{(booking.hourly_rate_cents / 100).toFixed(2)} /hr
          </span>
          <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
        </div>
      </div>
    </Link>
  );
}
