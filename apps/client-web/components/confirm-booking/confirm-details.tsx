"use client";

import { Button } from "@/components/ui/button";
import { StripeCardElement } from "../payment/stripe-card-element";
import { usePublicSiteSetting } from "@/lib/public-site-settings";

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
  const copy = usePublicSiteSetting("booking.web_copy", {
    confirmDetailsTitle: "Confirm details",
    paymentMethodTitle: "Payment method",
    paymentHoldNotice: "You may see a temporary hold on your payment method in the amount of your 100 Handy Pro's hourly rate. Don't worry - you're only billed when your task is complete!",
    paymentAuthorizedBody: "Payment authorized successfully. Your card has been held.",
    completeBooking: "Complete Booking",
    processing: "Processing...",
    preparingPayment: "Preparing payment...",
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8">
      <h2 className="mb-6 text-[30px] font-bold text-brand-dark">
        {copy.confirmDetailsTitle}
      </h2>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-[24px] font-bold text-brand-dark">
          {copy.paymentMethodTitle}
        </h3>

        <p className="mb-4 text-[16px] text-brand-dark">
          {copy.paymentHoldNotice}
        </p>

        {/* Payment already authorized - show retry booking button */}
        {authorizedPaymentId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
              <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm">{copy.paymentAuthorizedBody}</p>
            </div>
            <Button
              variant="terracotta"
              size="full"
              type="button"
              onClick={() => onPaymentSuccess(authorizedPaymentId)}
              disabled={isSubmitting}
            >
              {isSubmitting ? copy.processing : copy.completeBooking}
            </Button>
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
            <p className="mt-2 text-gray-600">{copy.preparingPayment}</p>
          </div>
        )}
      </div>

      {/* Pricing details are shown in the TaskSummary sidebar */}
    </div>
  );
}
