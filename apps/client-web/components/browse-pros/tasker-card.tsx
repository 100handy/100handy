"use client";

import Image from "next/image";
import { useState } from "react";
import { SelectDateTimeModal } from "./select-datetime-modal";

interface Tasker {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  minimumHours: number;
  tasksCompleted: number;
  overallTasks: number;
  vehicle: string;
  profileImage: string;
  bio: string;
  recentReview: {
    text: string;
    author: string;
    date: string;
  };
}

export function TaskerCard({ 
  tasker, 
  onSelectContinue 
}: { 
  tasker: Tasker;
  onSelectContinue?: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectContinue = () => {
    setIsModalOpen(false);
    onSelectContinue?.();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex gap-6">
          {/* Left Column - Profile Image and Actions */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={tasker.profileImage}
                alt={tasker.name}
                width={144}
                height={144}
                className="w-full h-full object-cover"
              />
            </div>
            <button className="text-[#C1856A] text-sm font-medium hover:underline whitespace-nowrap">
              View Profile &<br />Reviews
            </button>
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
                {tasker.name}
              </h3>
              <div className="text-[#333A31] text-2xl font-semibold">
                £{tasker.hourlyRate.toFixed(2)} /hr
              </div>
            </div>

            {/* Minimum Hours Badge */}
            <div className="inline-flex items-center bg-[#82BE56] text-white px-3 py-1 rounded text-xs font-semibold mb-3">
              {tasker.minimumHours} HOUR MINIMUM
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
                {tasker.rating.toFixed(1)} ({tasker.reviewCount} reviews)
              </span>
            </div>

            {/* Stats */}
            <div className="space-y-0.5 mb-4">
              <p className="text-[#333A31] text-sm font-medium">
                {tasker.tasksCompleted} General Mounting tasks
              </p>
              <p className="text-[#333A31] text-sm">
                {tasker.overallTasks} Mounting task overall
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
                  Vehicle: {tasker.vehicle}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              <h4 className="text-[#333A31] text-base font-semibold mb-2">
                How I can help:
              </h4>
              <p className="text-[#333A31] text-sm leading-relaxed mb-1">
                {tasker.bio}
              </p>
              <button className="text-[#333A31] text-sm font-semibold hover:text-[#C1856A]">
                Read More
              </button>
            </div>

            {/* Recent Review */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={tasker.profileImage}
                  alt={tasker.recentReview.author}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[#333A31] text-sm font-semibold mb-0.5">
                  {tasker.recentReview.author}. On {tasker.recentReview.date}
                </p>
                <p className="text-[#333A31] text-sm">
                  "{tasker.recentReview.text}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Time Selection Modal */}
      <SelectDateTimeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSelectContinue}
        taskerName={tasker.name}
      />
    </>
  );
}
