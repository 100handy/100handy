"use client";

import { StripeCardElement } from "../payment/stripe-card-element";

interface ConfirmDetailsProps {
  clientSecret?: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting: boolean;
}

export function ConfirmDetails({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  isSubmitting,
}: ConfirmDetailsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8">
      <h2 className="mb-6 text-[30px] font-bold text-[#333A31]">
        Confirm details
      </h2>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-[24px] font-bold text-[#333A31]">
          Payment method
        </h3>

        <p className="mb-4 text-[16px] text-[#333A31]">
          You may see a temporary hold on your payment method in the amount of your Tasker's hourly rate. Don't worry - you're only billed when your task is complete!
        </p>

        {/* Stripe Payment Form */}
        {clientSecret ? (
          <StripeCardElement
            clientSecret={clientSecret}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1856A]"></div>
            <p className="mt-2 text-gray-600">Preparing payment...</p>
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-8">
        <button className="text-[16px] font-bold text-[#C1856A] hover:underline">
          Do you have a promo code?
        </button>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-gray-200" />

      {/* Pricing Details */}
      <div className="space-y-2 text-[16px]">
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
