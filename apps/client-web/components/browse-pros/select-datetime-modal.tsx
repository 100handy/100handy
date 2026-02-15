"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AvailabilitySlot } from "@shared/supabase";

interface SelectDateTimeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (date: string, time: string) => void;
  taskerName: string;
  availability?: AvailabilitySlot[];
  isAvailabilityLoading?: boolean;
}

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDisplayDate = (date: Date) => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatTimeLabel = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours ?? 0;
  const minute = minutes ?? 0;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${ampm}`;
};

const toMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

const generateHourlySlots = (start: string, end: string) => {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes) || endMinutes <= startMinutes) {
    return [];
  }

  const slots: string[] = [];
  for (let current = startMinutes; current < endMinutes; current += 60) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    slots.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
  }
  return slots;
};

export function SelectDateTimeModal({
  open,
  onOpenChange,
  onConfirm,
  taskerName,
  availability,
  isAvailabilityLoading,
}: SelectDateTimeModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedTime, setSelectedTime] = useState("10:00");

  // Reset to today when modal opens to preserve previous UI behavior
  useEffect(() => {
    if (open) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setSelectedDate(today);
    }
  }, [open]);

  // Generate two months of calendar days (same UI as before)
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean; isPast: boolean }> = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();
    const lastDay = new Date(currentYear, currentMonth + 2, 0);

    if (startDay > 0) {
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        days.push({ date, isCurrentMonth: false, isPast: dateOnly < now });
      }
    }

    const currentDate = new Date(firstDay);
    while (days.length < 35 && currentDate <= lastDay) {
      const cellDate = new Date(currentDate);
      const dateOnly = new Date(currentDate);
      dateOnly.setHours(0, 0, 0, 0);
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isPast = dateOnly < now;
      days.push({ date: cellDate, isCurrentMonth, isPast });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, []);

  const getTimeSlotsForDate = useCallback(
    (date: Date | null) => {
      if (!date || !availability || availability.length === 0) return [];
      const dayOfWeek = date.getDay();
      const relevantSlots = availability.filter(
        (slot) => slot.is_active && slot.day_of_week === dayOfWeek
      );
      if (relevantSlots.length === 0) return [];

      const slots = relevantSlots.flatMap((slot) => {
        const start = slot.start_time.slice(0, 5);
        const end = slot.end_time.slice(0, 5);
        return generateHourlySlots(start, end);
      });

      const unique = Array.from(new Set(slots));
      return unique.sort((a, b) => toMinutes(a) - toMinutes(b));
    },
    [availability]
  );

  const availableTimes = useMemo(() => getTimeSlotsForDate(selectedDate), [selectedDate, getTimeSlotsForDate]);
  const hasAvailabilityData = Boolean(availability && availability.length > 0);

  // Auto-suggest first available slot when date changes
  useEffect(() => {
    if (!open) return;
    if (availableTimes.length > 0) {
      setSelectedTime(availableTimes[0]!);
    } else {
      setSelectedTime("10:00");
    }
  }, [availableTimes, open]);

  const isDateAvailable = useCallback(
    (date: Date) => {
      if (!hasAvailabilityData) return true;
      return getTimeSlotsForDate(date).length > 0;
    },
    [getTimeSlotsForDate, hasAvailabilityData]
  );

  const handleConfirm = () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    onConfirm?.(`${year}-${month}-${day}`, selectedTime);
    onOpenChange(false);
  };

  const isLoading = Boolean(isAvailabilityLoading);

  const currentMonthName = new Date().toLocaleString("default", { month: "long" });
  const nextMonthName = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString(
    "default",
    { month: "long" }
  );
  const year = new Date().getFullYear();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold text-brand-dark-alt">
            Choose your task date and start time:
          </DialogTitle>
        </DialogHeader>

        {/* Tasker Name and Availability */}
        <div className="mb-4">
          <p className="text-sm font-medium text-brand-dark-alt">
            {taskerName}&rsquo;s Availability
          </p>
          <p className="text-sm text-brand-dark-alt">
            {currentMonthName} → {nextMonthName} {year}
          </p>
          {isLoading && (
            <p className="mt-1 text-xs text-gray-500">Loading availability...</p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left side - Calendar */}
          <div>
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

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isSelected =
                  day.date.getDate() === selectedDate.getDate() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getFullYear() === selectedDate.getFullYear();
                const isAvailable = isDateAvailable(day.date);
                const isDisabled = day.isPast || (hasAvailabilityData && !isAvailable);

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && setSelectedDate(day.date)}
                    disabled={isDisabled}
                    aria-label={formatDisplayDate(day.date)}
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    className={`relative aspect-square rounded-lg p-2 text-center text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-brand-terracotta text-white"
                        : isDisabled
                          ? "text-gray-300 cursor-not-allowed"
                          : !day.isCurrentMonth
                            ? "text-gray-400 hover:bg-gray-100"
                            : "text-brand-dark-alt hover:bg-gray-100"
                    }`}
                  >
                    {day.date.getDate()}
                    {hasAvailabilityData && (
                      <span
                        className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                          isAvailable ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                    )}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-medium text-brand-dark-alt focus:border-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20"
              />
              <p className="mt-2 text-xs text-gray-600">
                You can chat to adjust task details or change start time after confirming.
              </p>

              {hasAvailabilityData && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Available slots
                  </p>
                  {availableTimes.length > 0 ? (
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-brand-dark-alt focus:border-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20"
                    >
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {formatTimeLabel(time)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      This day doesn&rsquo;t have availability yet. Try another date or message the Tasker.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Summary and Action */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-brand-dark-alt">
                Request for:
              </p>
              <p className="text-lg font-semibold text-brand-dark-alt">
                {formatDisplayDate(selectedDate)}, {formatTimeLabel(selectedTime)}
              </p>
            </div>

            <div>
              <button
                onClick={handleConfirm}
                disabled={!selectedTime}
                className={`w-full rounded-full bg-brand-terracotta px-6 py-3 font-semibold text-white transition-colors ${
                  selectedTime ? "hover:bg-brand-terracotta/85" : "opacity-70"
                }`}
              >
                Select & Continue
              </button>

              <div className="mt-4 flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
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
