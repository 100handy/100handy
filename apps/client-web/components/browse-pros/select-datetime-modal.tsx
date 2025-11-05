"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SelectDateTimeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (date: string, time: string) => void;
  taskerName: string;
}

export function SelectDateTimeModal({
  open,
  onOpenChange,
  onConfirm,
  taskerName,
}: SelectDateTimeModalProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState("10:00");

  // Reset to today when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDate(today);
      setSelectedTime("10:00");
    }
  }, [open]);

  // Generate calendar days dynamically
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean; isPast: boolean }> = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay(); // 0 = Sunday

    // Get last day of next month
    const lastDay = new Date(currentYear, currentMonth + 2, 0);

    // Add previous month's trailing days
    if (startDay > 0) {
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
        days.push({ date, isCurrentMonth: false, isPast: date < now });
      }
    }

    // Add current month and next month days (up to 35 days total for nice grid)
    let currentDate = new Date(firstDay);
    while (days.length < 35 && currentDate <= lastDay) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isPast = currentDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);
      days.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isPast
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, []);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Format display date
  const formatDisplayDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Format for database (YYYY-MM-DD)
  const formatDatabaseDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirm = () => {
    const formattedDate = formatDatabaseDate(selectedDate);
    onConfirm?.(formattedDate, selectedTime);
    onOpenChange(false);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Get month names for display
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const nextMonthName = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

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
          <p className="text-sm text-[#30352D]">
            {currentMonthName} → {nextMonthName} {year}
          </p>
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
              {calendarDays.map((day, index) => {
                const isSelected = isSameDay(day.date, selectedDate);
                const isPast = day.isPast;
                const isOtherMonth = !day.isCurrentMonth;

                return (
                  <button
                    key={index}
                    onClick={() => !isPast && setSelectedDate(day.date)}
                    disabled={isPast}
                    className={`aspect-square rounded-lg p-2 text-center text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#C1856A] text-white"
                        : isPast
                          ? "text-gray-300 cursor-not-allowed"
                          : isOtherMonth
                            ? "text-gray-400 hover:bg-gray-100"
                            : "text-[#30352D] hover:bg-gray-100"
                    }`}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
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
                {formatDisplayDate(selectedDate)}, {selectedTime}
              </p>
            </div>

            <div>
              <button
                onClick={handleConfirm}
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
