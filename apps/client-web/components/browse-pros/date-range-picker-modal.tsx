"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DateRangePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (startDate: Date, endDate: Date) => void;
  onClear: () => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
}

export function DateRangePickerModal({
  open,
  onOpenChange,
  onApply,
  onClear,
  initialStartDate,
  initialEndDate,
}: DateRangePickerModalProps) {
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStartDate(initialStartDate || null);
      setEndDate(initialEndDate || null);
    }
  }, [open, initialStartDate, initialEndDate]);

  // Generate calendar days for 2 months
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; isCurrentMonth: boolean; isPast: boolean }> = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
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

    // Add current month and next month days (up to 42 days for full 6-week grid)
    let currentDate = new Date(firstDay);
    while (days.length < 42 && currentDate <= lastDay) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const dateOnly = new Date(currentDate);
      dateOnly.setHours(0, 0, 0, 0);
      const isPast = dateOnly < now;
      days.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isPast
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, []);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Check if dates are the same day
  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Check if a date is in the selected range
  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return d > start && d < end;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // First click or reset: set as start date
      setStartDate(date);
      setEndDate(null);
    } else {
      // Second click: set as end date (swap if needed)
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  // Format display date
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "Select date";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(startDate, endDate);
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onClear();
    onOpenChange(false);
  };

  // Get month names for display
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const nextMonthName = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md p-4 sm:p-5">
        <DialogHeader>
          <DialogTitle className="mb-3 text-lg font-bold text-[#30352D]">
            Choose Date Range
          </DialogTitle>
        </DialogHeader>

        {/* Month labels */}
        <div className="mb-2">
          <p className="text-xs text-[#30352D]">
            {currentMonthName} → {nextMonthName} {year}
          </p>
        </div>

        {/* Days of week header */}
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {daysOfWeek.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="text-center text-xs font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((day, index) => {
            const isStart = isSameDay(day.date, startDate);
            const isEnd = isSameDay(day.date, endDate);
            const isSelected = isStart || isEnd;
            const inRange = isInRange(day.date);
            const isPast = day.isPast;
            const isOtherMonth = !day.isCurrentMonth;

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateClick(day.date)}
                disabled={isPast}
                aria-label={formatDisplayDate(day.date)}
                aria-selected={isSelected}
                aria-disabled={isPast}
                className={`aspect-square rounded-md p-1 text-center text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#C1856A] text-white"
                    : inRange
                      ? "bg-[#C1856A]/20 text-[#30352D]"
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

        {/* Selected range display */}
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-gray-500">From: </span>
              <span className="font-medium text-[#30352D]">{formatDisplayDate(startDate)}</span>
            </div>
            <span className="text-gray-400">→</span>
            <div>
              <span className="text-gray-500">To: </span>
              <span className="font-medium text-[#30352D]">{formatDisplayDate(endDate)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleClear}
            className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-[#30352D] transition-colors hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="flex-1 rounded-full bg-[#C1856A] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a67359] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
