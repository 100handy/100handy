"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBusinessInfo, updateVatId, updateBusinessInfo } from "@/lib/supabase/business";
import type { BusinessInfo } from "@/lib/supabase/types";
import { toast } from "sonner";

interface BusinessTabProps {
  mode: "vat" | "business";
}

export function BusinessTab({ mode }: BusinessTabProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [isEditingVat, setIsEditingVat] = useState(false);
  const [vatId, setVatId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");

  useEffect(() => {
    getBusinessInfo().then((data) => {
      setBusinessInfo(data);
      setVatId(data?.vat_id || "");
      setCompanyName(data?.company_name || "");
      setBusinessType(data?.business_type || "");
    });
  }, []);

  const handleSaveVatId = async () => {
    try {
      await updateVatId(vatId);
      toast.success("VAT ID updated successfully");
      setIsEditingVat(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update VAT ID");
    }
  };

  const handleSaveBusinessInfo = async () => {
    try {
      await updateBusinessInfo({
        company_name: companyName,
        business_type: businessType,
      });
      toast.success("Business information updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update business information");
    }
  };

  if (mode === "vat") {
    return (
      <>
        {!isEditingVat ? (
          <>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">VAT ID</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditingVat(true)}
                className="text-brand-terracotta border-brand-terracotta hover:bg-brand-terracotta hover:text-white w-full sm:w-auto mt-4 sm:mt-0 transition-colors"
              >
                Edit VAT ID
              </Button>
            </div>

            <div className="max-w-3xl">
              <p className="text-brand-dark text-sm leading-relaxed">
                If you operate as a VAT registered business, please enter your VAT number here – this prevents VAT
                being applied on the Service Fee and the Trust & Support Fee.
              </p>
              {vatId && (
                <p className="text-brand-dark text-sm leading-relaxed mt-4">
                  <strong>Current VAT ID:</strong> {vatId}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-8">Edit VAT ID</h2>

              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-brand-dark text-sm mb-2">VAT ID</label>
                  <input
                    type="text"
                    value={vatId}
                    onChange={(e) => setVatId(e.target.value)}
                    placeholder="e.g., GB123456789"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingVat(false);
                      setVatId(businessInfo?.vat_id || "");
                    }}
                    className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto px-6 h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveVatId}
                    className="bg-brand-terracotta hover:bg-brand-coral text-white w-full sm:w-auto px-6 h-9 text-sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Business Information mode
  return (
    <>
      <div className="mb-8">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
          Business Information
        </h2>

        <div className="max-w-3xl space-y-6">
          <p className="text-brand-dark text-sm leading-relaxed">
            Your information is required to comply with local and federal regulations. Failure to provide this
            information may cause payouts on your accounts to be paused until information is received.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g., Sole Trader, Limited Company"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
              />
            </div>
          </div>

          <Button onClick={handleSaveBusinessInfo} className="bg-brand-terracotta hover:bg-brand-coral text-white">
            Update my info
          </Button>
        </div>
      </div>
    </>
  );
}

