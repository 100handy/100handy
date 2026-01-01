"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SelectDateTimeModal } from "./select-datetime-modal";
import type { HandymanProfile } from "@/lib/supabase/handymen";
import type { AvailabilitySlot } from "@shared/supabase";

interface TaskerCardProps {
  handyman: HandymanProfile;
  categoryName: string;
  onSelectContinue?: (date: string, time: string) => void;
  availability?: AvailabilitySlot[];
  isAvailabilityLoading?: boolean;
}

export function TaskerCard({
  handyman,
  categoryName,
  onSelectContinue,
  availability,
  isAvailabilityLoading,
}: TaskerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectContinue = (date: string, time: string) => {
    setIsModalOpen(false);
    onSelectContinue?.(date, time);
  };

  // Convert cents to pounds for display
  const hourlyRate = handyman.hourly_rate_cents / 100;
  const displayName = handyman.display_name || `${handyman.first_name} ${handyman.last_name?.charAt(0) || ''}.`;
  const minimumHours = 2; // Default minimum
  const vehicleType = "Car"; // Default - can be enhanced later

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex gap-6">
          {/* Left Column - Profile Image and Actions */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={handyman.avatar_url || '/images/default-avatar.png'}
                alt={displayName}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
            <Link
              href={`/professionals/${handyman.user_id}`}
              className="text-[#C1856A] text-sm font-medium hover:underline whitespace-nowrap text-center"
            >
              View Profile &<br />Reviews
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#C1856A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#a67359] transition-colors whitespace-nowrap"
            >
              Select & Continue
            </button>
            <p className="text-gray-600 text-xs text-center leading-tight max-w-[144px]">
              You can chat with your Tasker, adjust task details, or change task time after booking
            </p>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Name and Price */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[#333A31] text-2xl font-semibold">
                {displayName}
              </h3>
              <div className="text-[#333A31] text-2xl font-semibold">
                £{hourlyRate.toFixed(2)} /hr
              </div>
            </div>

            {/* Minimum Hours Badge */}
            <div className="inline-flex items-center bg-[#82BE56] text-white px-3 py-1 rounded text-xs font-semibold mb-3">
              {minimumHours} HOUR MINIMUM
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-2">
              <svg
                className="w-4 h-4 text-black fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-[#333A31] text-sm font-medium">
                {handyman.rating.toFixed(1)} ({handyman.review_count || handyman.jobs_completed} reviews)
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-0.5 mb-4">
              <p className="text-[#333A31] text-sm font-medium">
                {handyman.jobs_completed} {categoryName} tasks
              </p>
              <p className="text-[#333A31] text-sm">
                {handyman.experience_years} years of experience
              </p>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-[#333A31]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span className="text-[#333A31] text-sm">
                  Vehicle: {vehicleType}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            {handyman.bio && (
              <div className="mb-4">
                <h4 className="text-[#333A31] text-base font-semibold mb-2">
                  How I can help:
                </h4>
                <p className="text-[#333A31] text-sm leading-relaxed mb-1">
                  {handyman.bio}
                </p>
                <button className="text-[#333A31] text-sm font-semibold hover:text-[#C1856A]">
                  Read More
                </button>
              </div>
            )}

            {/* Verified Badge */}
            {handyman.verified && (
              <div className="flex items-center gap-2 text-[#82BE56] text-sm font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Professional</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Time Selection Modal */}
      <SelectDateTimeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSelectContinue}
        taskerName={displayName}
        availability={availability}
        isAvailabilityLoading={isAvailabilityLoading}
      />
    </>
  );
}
