"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useHandymanProfile,
  useHandymanReviews,
  useProfessionalRating,
  useAvailabilityByUserId,
} from "@shared/supabase";
import { SelectDateTimeModal } from "@/components/browse-pros/select-datetime-modal";

// Day names for availability display
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data using shared hooks
  const { data: profile, isLoading: profileLoading } = useHandymanProfile(id);
  const { data: reviews, isLoading: reviewsLoading } = useHandymanReviews(id, 10);
  const { data: ratingData } = useProfessionalRating(id);
  const { data: availability, isLoading: availabilityLoading } = useAvailabilityByUserId(id);

  // Handle booking selection
  const handleSelectContinue = (date: string, time: string) => {
    setIsModalOpen(false);
    // Navigate to task form with pre-selected handyman
    router.push(`/task-form?handyman=${id}&date=${date}&time=${time}`);
  };

  // Loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1856A]"></div>
      </div>
    );
  }

  // Not found state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Professional Not Found</h1>
        <Link href="/" className="text-[#C1856A] hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const displayName = profile.display_name || `${profile.first_name || ''} ${profile.last_name?.charAt(0) || ''}.`.trim();
  const hourlyRate = profile.hourly_rate_cents / 100;
  const rating = ratingData?.averageRating || profile.rating || 0;
  const totalReviews = ratingData?.totalReviews || profile.review_count || 0;
  const avatarUrl = profile.avatar_url || '/images/default-avatar.png';

  // Format time for display (HH:MM:SS -> HH:MM AM/PM)
  const formatTime = (time: string) => {
    const parts = time.split(':');
    const hours = parts[0] || '0';
    const minutes = parts[1] || '00';
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-[#30352D]">Professional Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-[#30352D] flex items-center gap-2">
                        {displayName}
                        {profile.verified && (
                          <svg className="w-6 h-6 text-[#82BE56]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </h2>
                      {profile.postcode && (
                        <p className="text-gray-500 text-sm">{profile.postcode}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#30352D]">£{hourlyRate.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">/hour</p>
                    </div>
                  </div>

                  {/* Rating and Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="font-semibold text-[#30352D]">{rating.toFixed(1)}</span>
                      <span className="text-gray-500">({totalReviews} reviews)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">{profile.jobs_completed} jobs completed</span>
                  </div>

                  {/* Experience */}
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {profile.experience_years} years experience
                    </span>
                    {profile.vehicle && (
                      <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                        {profile.vehicle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {profile.bio && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#30352D] mb-3">About Me</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </div>
            )}

            {/* Availability Section */}
            {availability && availability.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#30352D] mb-4">Weekly Availability</h3>
                <div className="grid grid-cols-7 gap-2">
                  {DAY_NAMES.map((day, index) => {
                    const slot = availability.find(s => s.day_of_week === index && s.is_active);
                    return (
                      <div key={day} className="text-center">
                        <p className="text-sm font-medium text-gray-500 mb-2">{day}</p>
                        {slot ? (
                          <div className="bg-green-50 text-green-700 rounded-lg p-2 text-xs">
                            <p>{formatTime(slot.start_time)}</p>
                            <p>-</p>
                            <p>{formatTime(slot.end_time)}</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 text-gray-400 rounded-lg p-2 text-xs">
                            <p>Not</p>
                            <p>available</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#30352D]">
                  Reviews ({totalReviews})
                </h3>
              </div>

              {reviewsLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1856A] mx-auto"></div>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C1856A] flex items-center justify-center text-white font-medium">
                          C
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[#30352D]">
                              Customer
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#30352D] mb-4">Book {displayName}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hourly rate</span>
                    <span className="font-medium text-[#30352D]">£{hourlyRate.toFixed(2)}/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minimum</span>
                    <span className="font-medium text-[#30352D]">2 hours</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#C1856A] text-white py-3 rounded-full font-medium hover:bg-[#a67359] transition-colors"
                >
                  Select & Continue
                </button>
                <p className="text-gray-500 text-xs text-center mt-4">
                  You can chat with your Tasker and adjust task details after booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-[#30352D]">£{hourlyRate.toFixed(2)}/hr</p>
            <p className="text-gray-500 text-sm">2 hour minimum</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C1856A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#a67359] transition-colors"
          >
            Select & Continue
          </button>
        </div>
      </div>

      {/* Add padding for mobile bottom bar */}
      <div className="lg:hidden h-24" />

      {/* Date Time Selection Modal */}
      <SelectDateTimeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSelectContinue}
        taskerName={displayName}
        availability={availability}
        isAvailabilityLoading={availabilityLoading}
      />
    </div>
  );
}
