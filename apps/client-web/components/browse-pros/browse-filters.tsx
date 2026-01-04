"use client";

import { useState, useEffect } from "react";
import { DateRangePickerModal } from "./date-range-picker-modal";

// Type-safe date filter options
export type DateFilterOption = 'today' | '3days' | 'week' | 'custom';

// Type-safe time slot options
export type TimeSlotOption = 'morning' | 'afternoon' | 'evening';

export interface FilterValues {
  selectedDate: DateFilterOption;
  selectedTimes: TimeSlotOption[];
  specificTime?: string | null; // "HH:MM" (24h) or null for flexible
  priceMin: number;
  priceMax: number;
  isEliteTasker: boolean;
  customDateRange?: { start: Date; end: Date } | null;
}

interface BrowseFiltersProps {
  onFilterChange?: (filters: FilterValues) => void;
}

export function BrowseFilters({ onFilterChange }: BrowseFiltersProps) {
  const [selectedDate, setSelectedDate] = useState<DateFilterOption>("week");
  const [selectedTimes, setSelectedTimes] = useState<TimeSlotOption[]>([]);
  const [specificTime, setSpecificTime] = useState<string>(""); // empty = flexible
  const [priceRange, setPriceRange] = useState({ min: 10, max: 150 });
  const [sliderValues, setSliderValues] = useState({ min: 10, max: 90 });
  const [isEliteTasker, setIsEliteTasker] = useState(false);

  // Custom date range state
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        selectedDate,
        selectedTimes,
        specificTime: specificTime || null,
        priceMin: sliderValues.min,
        priceMax: sliderValues.max,
        isEliteTasker,
        customDateRange: selectedDate === 'custom' ? customDateRange : null,
      });
    }
  }, [selectedDate, selectedTimes, specificTime, sliderValues, isEliteTasker, customDateRange, onFilterChange]);

  // Handle date option click
  const handleDateOptionClick = (value: DateFilterOption) => {
    if (value === 'custom') {
      setIsDatePickerOpen(true);
    } else {
      setSelectedDate(value);
      setCustomDateRange(null);
    }
  };

  // Handle custom date range apply
  const handleDateRangeApply = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setSelectedDate('custom');
  };

  // Handle custom date range clear
  const handleDateRangeClear = () => {
    setCustomDateRange(null);
    setSelectedDate('week');
  };

  // Format date range for display
  const formatDateRange = (range: { start: Date; end: Date }) => {
    const formatDate = (date: Date) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  };

  const priceDistribution = [
    0.2, 0.3, 0.4, 0.6, 0.9, 1, 0.8, 0.7, 0.5, 0.4, 0.3, 0.2, 0.25, 0.35, 0.55,
    0.75, 0.95, 0.85, 0.65, 0.45, 0.25,
  ];

  const dateOptions: { value: DateFilterOption; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "3days", label: "Within 3 Days" },
    { value: "week", label: "Within A Week" },
    { value: "custom", label: "Choose Dates" },
  ];

  const timeSlots: { value: TimeSlotOption; label: string }[] = [
    { value: "morning", label: "Morning (8:00 - 12:00)" },
    { value: "afternoon", label: "Afternoon (12:00 - 17:00)" },
    { value: "evening", label: "Evening (17:00 - 21:30)" },
  ];

  const formatTimeLabel = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const hour = hours ?? 0;
    const minute = minutes ?? 0;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minute).padStart(2, "0")} ${ampm}`;
  };

  const specificTimeOptions = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, "0")}:00`);

  const handleSliderChange = (type: 'min' | 'max', value: number) => {
    setSliderValues(prev => {
      const newValues = { ...prev, [type]: value };
      
      // Ensure min doesn't exceed max and vice versa
      if (type === 'min' && newValues.min >= newValues.max) {
        newValues.max = Math.min(newValues.min + 1, priceRange.max);
      } else if (type === 'max' && newValues.max <= newValues.min) {
        newValues.min = Math.max(newValues.max - 1, priceRange.min);
      }
      
      return newValues;
    });
  };

  const getSliderPosition = (value: number) => {
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-5">
      {/* Date Filter */}
      <div>
        <h3 className="text-[#30352D] text-sm font-semibold mb-3">Date</h3>
        <div className="grid grid-cols-2 gap-2">
          {dateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDateOptionClick(option.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedDate === option.value
                  ? "bg-[#30352D] text-white"
                  : "border border-gray-300 text-[#30352D] bg-white hover:border-[#30352D]"
                }`}
            >
              {option.value === 'custom' && customDateRange
                ? formatDateRange(customDateRange)
                : option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Time of Day */}
      <div>
        <h3 className="text-[#30352D] text-sm font-semibold mb-3">Time of day</h3>
        <div className="space-y-2.5">
          {timeSlots.map((slot) => (
            <label key={slot.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTimes.includes(slot.value)}
                onChange={(e) => {
                  // "or choose a specific time" - switching to time-of-day clears a specific-time choice
                  if (specificTime) setSpecificTime("");
                  if (e.target.checked) {
                    setSelectedTimes([...selectedTimes, slot.value]);
                  } else {
                    setSelectedTimes(selectedTimes.filter((t): t is TimeSlotOption => t !== slot.value));
                  }
                }}
                className="w-4 h-4 rounded-sm border border-gray-300 accent-[#30352D] focus:outline-none focus:ring-1 focus:ring-[#30352D]"
              />
              <span className="text-[#30352D] text-sm">{slot.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 text-center">
          <span className="text-gray-500 text-xs">or choose a specific time</span>
        </div>
        <div className="mt-3">
          <select
            value={specificTime}
            onChange={(e) => {
              const value = e.target.value;
              setSpecificTime(value);
              // "or" behavior: picking a specific time clears time-of-day buckets
              if (value) setSelectedTimes([]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-[#30352D] focus:outline-none focus:ring-1 focus:ring-[#30352D]"
          >
            <option value="">I'm flexible</option>
            {specificTimeOptions.map((time) => (
              <option key={time} value={time}>
                {formatTimeLabel(time)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Price Range */}
      <div>
        <h3 className="text-[#30352D] text-sm font-semibold mb-3">Price</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[#30352D] text-sm font-medium">£{sliderValues.min}</span>
            <div className="flex-1 relative h-8">
              {/* Bar chart background */}
              <div className="absolute bottom-0 w-full flex items-end justify-between h-full">
                {priceDistribution.map((height, index) => (
                  <div
                    key={index}
                    className="bg-gray-300"
                    style={{
                      height: `${height * 100}%`,
                      width: `calc(${100 / priceDistribution.length}% - 1px)`,
                      marginRight: index < priceDistribution.length - 1 ? '1px' : '0',
                    }}
                  />
                ))}
              </div>
              {/* Slider track and handles */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full">
                <div className="h-1.5 bg-transparent rounded-full">
                  <div
                    className="absolute h-1.5 bg-[#C1856A] rounded-full"
                    style={{ 
                      left: `${getSliderPosition(sliderValues.min)}%`, 
                      width: `${getSliderPosition(sliderValues.max) - getSliderPosition(sliderValues.min)}%` 
                    }}
                  />
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#C1856A] rounded-full shadow cursor-pointer z-20"
                  style={{ left: `${getSliderPosition(sliderValues.min)}%` }}
                  onMouseDown={(e) => {
                    const slider = e.currentTarget.parentElement;
                    if (!slider) return;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const rect = slider.getBoundingClientRect();
                      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                      const value = Math.round(priceRange.min + (percent / 100) * (priceRange.max - priceRange.min));
                      handleSliderChange('min', value);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#C1856A] rounded-full shadow cursor-pointer z-20"
                  style={{ left: `${getSliderPosition(sliderValues.max)}%` }}
                  onMouseDown={(e) => {
                    const slider = e.currentTarget.parentElement;
                    if (!slider) return;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const rect = slider.getBoundingClientRect();
                      const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                      const value = Math.round(priceRange.min + (percent / 100) * (priceRange.max - priceRange.min));
                      handleSliderChange('max', value);
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            </div>
            <span className="text-[#30352D] text-sm font-medium">
              £{sliderValues.max}+
            </span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            The average hourly rate is £54.27 /hr
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Tasker Type */}
      <div>
        <h3 className="text-[#30352D] text-sm font-semibold mb-3">Tasker type</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isEliteTasker}
            onChange={(e) => setIsEliteTasker(e.target.checked)}
            className="w-4 h-4 rounded-sm border border-gray-300 accent-[#30352D] focus:outline-none focus:ring-1 focus:ring-[#30352D]"
          />
          <span className="text-[#30352D] text-sm">Elite Tasker</span>
        </label>
      </div>

      {/* Date Range Picker Modal */}
      <DateRangePickerModal
        open={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
        onApply={handleDateRangeApply}
        onClear={handleDateRangeClear}
        initialStartDate={customDateRange?.start}
        initialEndDate={customDateRange?.end}
      />
    </div>
  );
}
