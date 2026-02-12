"use client";

import { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isSubmitting: boolean;
}

function PaymentForm({ clientSecret, onSuccess, onError, isSubmitting }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [elementError, setElementError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmFailed, setConfirmFailed] = useState(false);

  // Retryable Stripe error codes — user can fix and retry
  const RETRYABLE_CODES = new Set([
    'card_declined',
    'expired_card',
    'incorrect_cvc',
    'incorrect_number',
    'insufficient_funds',
    'processing_error',
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || isConfirming || confirmFailed) {
      return;
    }

    try {
      setIsConfirming(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        const maybeError = error as unknown as {
          code?: string;
          message?: string;
          payment_intent?: { id?: string; status?: string };
        };
        // If the intent is already authorized, proceed as success (idempotent behavior).
        if (
          maybeError.code === 'payment_intent_unexpected_state' &&
          maybeError.payment_intent?.status === 'requires_capture' &&
          maybeError.payment_intent?.id
        ) {
          onSuccess(maybeError.payment_intent.id);
          return;
        }

        const errorCode = error.code || maybeError.code || '';
        const isRetryable = RETRYABLE_CODES.has(errorCode);

        if (!isRetryable) {
          // Non-retryable error — intent is in a bad state, prevent further attempts
          setConfirmFailed(true);
        }

        const code = errorCode ? ` (${errorCode})` : "";
        const detailedMessage = `${error.message || 'Payment failed'}${code}`;
        console.error("Stripe confirmPayment error:", error);
        onError(detailedMessage);
      } else if (paymentIntent && paymentIntent.status === 'requires_capture') {
        // Authorization successful! Card is on hold
        onSuccess(paymentIntent.id);
      } else {
        setConfirmFailed(true);
        onError(`Unexpected payment status: ${paymentIntent?.status || "unknown"}`);
      }
    } catch (err) {
      setConfirmFailed(true);
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        onReady={() => {
          console.log('PaymentElement ready');
          setElementError(null);
        }}
        onLoadError={(error) => {
          console.error('PaymentElement load error:', error);
          const errorMessage = (error as any)?.error?.message || (error as any)?.message || 'Failed to load payment form';
          setElementError(errorMessage);
        }}
      />
      {elementError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-red-800 text-sm">{elementError}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting || isConfirming || confirmFailed || !!elementError}
        className="w-full rounded-lg bg-brand-terracotta px-4 py-3 text-[16px] font-bold text-white transition-colors hover:bg-brand-terracotta/85 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {confirmFailed
          ? 'Payment failed — go back and retry'
          : isSubmitting || isConfirming
            ? 'Processing...'
            : 'Authorize Payment'}
      </button>
      <p className="text-xs text-gray-600 text-center">
        Your card will be authorized but not charged until the task is completed
      </p>
    </form>
  );
}

interface StripeCardElementProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isSubmitting: boolean;
}

export function StripeCardElement({
  clientSecret,
  onSuccess,
  onError,
  isSubmitting,
}: StripeCardElementProps) {
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);

  useEffect(() => {
    console.log('StripeCardElement received clientSecret:', clientSecret ? 'Present' : 'Missing');
    console.log('Stripe publishable key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing');

    if (clientSecret) {
      setOptions({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#C1856A',
            colorBackground: '#ffffff',
            colorText: '#333A31',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      });
    }
  }, [clientSecret]);

  if (!options) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-terracotta"></div>
        <p className="mt-2 text-gray-600">Loading payment form...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        isSubmitting={isSubmitting}
      />
    </Elements>
  );
}
