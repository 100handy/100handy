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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Confirm the payment
      // This will place an authorization hold on the card (not charge it)
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'requires_capture') {
        // Authorization successful! Card is on hold
        onSuccess(paymentIntent.id);
      } else {
        onError('Unexpected payment status');
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
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
          setElementError(error.message || 'Failed to load payment form');
        }}
      />
      {elementError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-red-800 text-sm">{elementError}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting || !!elementError}
        className="w-full rounded-lg bg-[#C1856A] px-4 py-3 text-[16px] font-bold text-white transition-colors hover:bg-[#a67359] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Authorize Payment'}
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C1856A]"></div>
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
