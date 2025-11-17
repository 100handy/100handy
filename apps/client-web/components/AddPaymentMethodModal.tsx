"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string;
  onSuccess: () => void;
}

function PaymentForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/account",
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Failed to add payment method");
      } else {
        toast.success("Payment method added successfully");
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="text-brand-dark border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-brand-terracotta hover:bg-brand-coral text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isProcessing ? "Adding..." : "Add Card"}
        </Button>
      </div>
    </form>
  );
}

export function AddPaymentMethodModal({
  open,
  onOpenChange,
  clientSecret,
  onSuccess,
}: AddPaymentMethodModalProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#C1856A",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-dark text-xl font-semibold">
            Add Payment Method
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                onSuccess={() => {
                  onSuccess();
                  onOpenChange(false);
                }}
                onCancel={() => onOpenChange(false)}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
