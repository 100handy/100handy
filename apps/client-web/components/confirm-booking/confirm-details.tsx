"use client";

import { StripeCardElement } from "../payment/stripe-card-element";

interface ConfirmDetailsProps {
  clientSecret?: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isSubmitting: boolean;
  authorizedPaymentId?: string;
}

export function ConfirmDetails({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  isSubmitting,
  authorizedPaymentId,
}: ConfirmDetailsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8">
      <h2 className="mb-6 text-[30px] font-bold text-brand-dark">
        Confirm details
      </h2>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-[24px] font-bold text-brand-dark">
          Payment method
        </h3>

        <p className="mb-4 text-[16px] text-brand-dark">
          You may see a temporary hold on your payment method in the amount of your 100 Handy Pro's hourly rate. Don't worry - you're only billed when your task is complete!
        </p>

        {/* Payment already authorized - show retry booking button */}
        {authorizedPaymentId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
              <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm">Payment authorized successfully. Your card has been held.</p>
            </div>
            <button
              type="button"
              onClick={() => onPaymentSuccess(authorizedPaymentId)}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-terracotta px-4 py-3 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/85 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Complete Booking'}
            </button>
          </div>
        ) : clientSecret ? (
          <StripeCardElement
            clientSecret={clientSecret}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-terracotta"></div>
            <p className="mt-2 text-gray-600">Preparing payment...</p>
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-8">
        <button className="text-[16px] font-bold text-brand-terracotta hover:underline">
          Do you have a promo code?
        </button>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-gray-200" />

      {/* Pricing Details */}
      <div className="space-y-2 text-[16px]">
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
          <span className="font-medium text-brand-terracotta">Learn more</span>
          <span> about our cancellation policy.</span>
        </p>
      </div>
    </div>
  );
}
