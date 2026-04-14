"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskSummaryProps {
  handymanName?: string;
  handymanAvatar?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  address?: string;
  taskSize?: string;
  vehicleRequirement?: string;
  taskDetails?: string;
  hourlyRateCents?: number;
  onEdit?: () => void;
  onConfirm?: () => void;
  isSubmitting?: boolean;
}

const getTaskSizeLabel = (size: string) => {
  switch (size) {
    case 'small': return 'Small – Est. 1 hr';
    case 'medium': return 'Medium – Est. 2-3 hrs';
    case 'large': return 'Large – Est. 4+ hrs';
    default: return size;
  }
};

const formatScheduledDate = (dateStr: string) => {
  if (!dateStr) return dateStr;
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getVehicleLabel = (vehicle: string) => {
  switch (vehicle) {
    case 'not-needed': return 'Vehicle not needed';
    case 'car': return 'Task requires a car';
    case 'truck': return 'Task requires a truck';
    default: return vehicle;
  }
};

export function TaskSummary({
  handymanName = "Handyman",
  handymanAvatar,
  scheduledDate = "Fri, Oct 3",
  scheduledTime = "16:00",
  address = "London, England E7 9EU",
  taskSize = "medium",
  vehicleRequirement = "car",
  taskDetails = "Task details will appear here",
  hourlyRateCents = 7027,
  onEdit,
  onConfirm,
  isSubmitting = false
}: TaskSummaryProps) {
  const hourlyRate = hourlyRateCents / 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {/* Professional Profile */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
          {handymanAvatar ? (
            <Image
              src={handymanAvatar}
              alt={handymanName}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium text-gray-600">
              {handymanName.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <p className="text-[18px] font-medium text-brand-dark">{handymanName}</p>
        </div>
      </div>

      {/* Task Details */}
      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-dark" />
          <p className="text-[18px] text-brand-dark">{formatScheduledDate(scheduledDate)} at {scheduledTime}</p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-dark" />
          <p className="text-[18px] text-brand-dark">{address}</p>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-dark" />
          <p className="text-[18px] text-brand-dark">{getTaskSizeLabel(taskSize)}</p>
        </div>

        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-dark" />
          <p className="text-[18px] text-brand-dark">{getVehicleLabel(vehicleRequirement)}</p>
        </div>
      </div>

      {/* Edit Task Button */}
      {onEdit && (
        <Button
          variant="terracotta-outline"
          size="full"
          className="mb-6"
          onClick={onEdit}
        >
          Edit Task
        </Button>
      )}

      {/* Task Details */}
      <div className="mb-6">
        <p className="mb-2 text-[14px] font-medium text-brand-dark">
          Your Task details
        </p>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-[18px] leading-relaxed text-brand-dark">
            {taskDetails}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-200" />

      {/* Hourly Rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-brand-dark">Hourly Rate</p>
          <p className="text-[18px] font-bold text-brand-dark">£{hourlyRate.toFixed(2)} /hr</p>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="space-y-2 text-[14px] mb-6">
        <p className="text-brand-dark">
          <span>Pricing is inclusive of a </span>
          <span className="font-medium text-brand-terracotta">£10.68/hr Trust & Support fee.</span>
          <span className="font-medium text-brand-terracotta"> Pricing includes VAT </span>
          <span>which is billed on the Trust & Support Fee and our Service Fee.</span>
        </p>

        <p className="text-brand-dark">
          You will not be billed until your task is complete. Tasks have a one-hour minimum. You can cancel or reschedule anytime.
        </p>

        <p className="text-brand-dark">
          If you cancel your task within 24 hours of the scheduled start time, you may be billed a one-hour cancellation fee at the Pro's hourly rate.
        </p>

        <p className="text-brand-dark">
          <a href="/help/cancellation-policy" className="font-medium text-brand-terracotta hover:underline">Learn more</a>
          <span> about our cancellation policy.</span>
        </p>
      </div>

      {/* Confirm Button */}
      {onConfirm && (
        <Button
          variant="terracotta"
          size="full"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating booking...' : 'Confirm and Chat'}
        </Button>
      )}
    </div>
  );
}
