"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelectDateTimeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  taskerName: string;
}

export function SelectDateTimeModal({
  open,
  onOpenChange,
  onConfirm,
  taskerName,
}: SelectDateTimeModalProps) {
  const [selectedDate, setSelectedDate] = useState<number>(3);
  const [selectedTime, setSelectedTime] = useState("16:00");

  // Calendar data for September-October 2025
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const calendarDays = [
    { date: 28, month: "sep" },
    { date: 29, month: "sep" },
    { date: 30, month: "sep" },
    { date: 1, month: "oct" },
    { date: 2, month: "oct" },
    { date: 3, month: "oct", highlighted: true },
    { date: 4, month: "oct" },
    { date: 5, month: "oct" },
    { date: 6, month: "oct" },
    { date: 7, month: "oct" },
    { date: 8, month: "oct" },
    { date: 9, month: "oct" },
    { date: 10, month: "oct" },
    { date: 11, month: "oct" },
    { date: 12, month: "oct" },
    { date: 13, month: "oct" },
    { date: 14, month: "oct" },
    { date: 15, month: "oct" },
    { date: 16, month: "oct" },
    { date: 17, month: "oct" },
    { date: 18, month: "oct" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold text-[#30352D]">
            Choose your task date and start time:
          </DialogTitle>
        </DialogHeader>

        {/* Tasker Name and Availability */}
        <div className="mb-4">
          <p className="text-sm font-medium text-[#30352D]">
            {taskerName}'s Availability
          </p>
          <p className="text-sm text-[#30352D]">September → October 2025</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left side - Calendar */}
          <div>
            {/* Days of week header */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`aspect-square rounded-lg p-2 text-center text-sm font-medium transition-colors ${
                    selectedDate === day.date
                      ? "bg-[#C1856A] text-white"
                      : day.month === "sep"
                        ? "text-gray-400 hover:bg-gray-100"
                        : "text-[#30352D] hover:bg-gray-100"
                  }`}
                >
                  {day.date}
                </button>
              ))}
            </div>

            {/* Time selector */}
            <div className="mt-6">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-medium text-[#30352D] focus:border-[#C1856A] focus:outline-none focus:ring-2 focus:ring-[#C1856A]/20"
              />
              <p className="mt-2 text-xs text-gray-600">
                You can chat to adjust task details or change start time after confirming.
              </p>
            </div>
          </div>

          {/* Right side - Summary and Action */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-[#30352D]">
                Request for:
              </p>
              <p className="text-lg font-semibold text-[#30352D]">
                Oct {selectedDate}, {selectedTime}
              </p>
            </div>

            <div>
              <button
                onClick={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
                className="w-full rounded-full bg-[#C1856A] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#a67359]"
              >
                Select & Continue
              </button>

              <div className="mt-4 flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#82BE56]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs leading-tight text-gray-600">
                  Next, confirm your details to get connected with your Tasker.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
