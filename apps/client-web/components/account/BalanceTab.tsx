"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAccountBalance, applyPromoCode } from "@/lib/supabase/balance";
import { toast } from "sonner";

export function BalanceTab() {
  const [accountBalance, setAccountBalance] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    getAccountBalance().then(setAccountBalance);
  }, []);

  const handleApplyPromoCode = async () => {
    const result = await applyPromoCode(promoCode);
    if (result.success) {
      toast.success(result.message);
      setPromoCode("");
      getAccountBalance().then(setAccountBalance);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
          Account Balance
        </h2>

        <div className="max-w-3xl space-y-6">
          <div>
            <p className="text-brand-dark text-sm font-semibold">
              Available account balance: £{(accountBalance / 100).toFixed(2)}
            </p>
            <p className="text-brand-dark text-xs mt-1">
              *Account balances are automatically applied when a task is completed.
            </p>
          </div>

          <div>
            <label className="block text-brand-dark text-sm mb-2">Enter a redemption code:</label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
            />
          </div>

          <Button
            onClick={handleApplyPromoCode}
            disabled={!promoCode}
            className="bg-brand-terracotta hover:bg-brand-coral text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            Apply
          </Button>
        </div>
      </div>
    </>
  );
}

