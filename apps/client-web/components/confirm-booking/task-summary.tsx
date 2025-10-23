"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock, Truck } from "lucide-react";

export function TaskSummary() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {/* Tasker Profile */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
          <Image
            src="/images/tasker-placeholder.jpg"
            alt="Mike W."
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-[18px] font-medium text-[#333A31]">Mike W.</p>
        </div>
      </div>

      {/* Task Details */}
      <div className="mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#333A31]" />
          <p className="text-[18px] text-[#333A31]">Fri, Oct 3 at 16:00</p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#333A31]" />
          <p className="text-[18px] text-[#333A31]">London, England E7 9EU</p>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#333A31]" />
          <p className="text-[18px] text-[#333A31]">Medium – Est. 2–3 hrs</p>
        </div>

        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#333A31]" />
          <p className="text-[#18px] text-[#333A31]">Task requires a car</p>
        </div>
      </div>

      {/* Edit Task Button */}
      <button className="mb-6 w-full rounded-lg border border-[#C1856A] bg-white px-4 py-2.5 text-[16px] font-medium text-[#C1856A] transition-colors hover:bg-[#C1856A]/5">
        Edit Task
      </button>

      {/* Task Details */}
      <div className="mb-6">
        <p className="mb-2 text-[14px] font-medium text-[#333A31]">
          Your Task details
        </p>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-[18px] leading-relaxed text-[#333A31]">
            I need help mounting a 55-inch TV on the living room wall. The wall is plasterboard, and I already have the bracket. Please make sure cables are hidden neatly.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-200" />

      {/* Hourly Rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold text-[#333A31]">Hourly Rate</p>
          <p className="text-[18px] font-bold text-[#333A31]">£70.27 /hr</p>
        </div>
      </div>

      {/* Pricing Details */}
      <div className="space-y-2 text-[14px]">
        <p className="text-[#333A31]">
          <span>Pricing is inclusive of a </span>
          <span className="font-medium text-[#C1856A]">£10.68/hr Trust & Support fee.</span>
          <span className="font-medium text-[#C1856A]"> Pricing includes VAT </span>
          <span>which is billed on the Trust & Support Fee and our Service Fee.</span>
        </p>

        <p className="text-[#333A31]">
          You will not be billed until your task is complete. Tasks have a one-hour minimum. You can cancel or reschedule anytime.
        </p>

        <p className="text-[#333A31]">
          If you cancel your task within 24 hours of the scheduled start time, you may be billed a one-hour cancellation fee at the Pro's hourly rate.
        </p>

        <p className="text-[#333A31]">
          <span className="font-medium text-[#C1856A]">Learn more</span>
          <span> about our cancellation policy.</span>
        </p>
      </div>
    </div>
  );
}
