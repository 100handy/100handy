"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddPaymentMethodModal } from "@/components/AddPaymentMethodModal";
import {
  getOrCreateStripeCustomer,
  createSetupIntent,
  listPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  type PaymentMethod,
} from "@/lib/stripe/payment-methods";
import { toast } from "sonner";

export function BillingTab() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('stripe_customer_id') || "";
    setCustomerId(cached);
    loadPaymentMethods(cached);
  }, []);

  const loadPaymentMethods = async (cachedId?: string) => {
    try {
      setLoading(true);

      // Use cached customer ID if available, otherwise fetch
      let stripeCustomerId = cachedId ?? customerId;
      if (!stripeCustomerId) {
        stripeCustomerId = await getOrCreateStripeCustomer();
        setCustomerId(stripeCustomerId);
        // Cache the customer ID for future loads
        localStorage.setItem('stripe_customer_id', stripeCustomerId);
      }

      const methods = await listPaymentMethods(stripeCustomerId);
      setPaymentMethods(methods);
    } catch (error: any) {
      toast.error(error.message || "Failed to load payment methods");
      // Clear cached customer ID on error
      localStorage.removeItem('stripe_customer_id');
      setCustomerId("");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      if (!customerId) {
        const stripeCustomerId = await getOrCreateStripeCustomer();
        setCustomerId(stripeCustomerId);
      }

      const secret = await createSetupIntent(customerId);
      setClientSecret(secret);
      setAddCardModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate card addition");
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(customerId, paymentMethodId);
      toast.success("Default payment method updated");
      await loadPaymentMethods();
    } catch (error: any) {
      toast.error(error.message || "Failed to set default payment method");
    }
  };

  const handleConfirmDeleteCard = async () => {
    if (!deleteCardId) return;
    try {
      await deletePaymentMethod(deleteCardId);
      toast.success("Card removed successfully");
      await loadPaymentMethods();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove card");
    } finally {
      setDeleteCardId(null);
    }
  };

  const getCardBrandLogo = (brand?: string) => {
    const logos: Record<string, string> = {
      visa: "🟦",
      mastercard: "🟧",
      amex: "🟩",
      discover: "🟨",
    };
    return logos[brand?.toLowerCase() || ""] || "💳";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">Payment Methods</h2>
        <Button
          onClick={handleAddCard}
          className="bg-brand-terracotta hover:bg-brand-coral text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Card
        </Button>
      </div>

      <div className="max-w-2xl">
        {loading ? (
          <div className="space-y-4">
            {/* Skeleton loaders */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-brand-dark font-medium mb-2">No payment methods added</p>
            <p className="text-gray-500 text-sm mb-6">
              Add a card to make payments easier
            </p>
            <Button
              onClick={handleAddCard}
              className="bg-brand-terracotta hover:bg-brand-coral text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-brand-terracotta transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getCardBrandLogo(pm.brand)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-brand-dark font-medium">
                        {pm.brand?.toUpperCase()} •••• {pm.last4}
                      </p>
                      {pm.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                          <Check className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      Expires {pm.expMonth?.toString().padStart(2, "0")}/{pm.expYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(pm.id)}
                      className="text-brand-dark border-gray-300 hover:bg-gray-50"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteCardId(pm.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <p className="text-brand-dark text-xs sm:text-sm mt-6 pt-6 border-t border-gray-200">
              Payment method will be used for all tasks, including the ones currently open.
            </p>
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        open={addCardModalOpen}
        onOpenChange={setAddCardModalOpen}
        clientSecret={clientSecret}
        onSuccess={loadPaymentMethods}
      />

      {/* Delete Card Confirmation Dialog */}
      <Dialog open={!!deleteCardId} onOpenChange={(open) => !open && setDeleteCardId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">Remove Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-brand-dark text-sm text-center">Are you sure you want to remove this card?</p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setDeleteCardId(null)}
                variant="outline"
                className="text-brand-dark border-gray-300 hover:bg-gray-50 px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteCard}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-8"
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
