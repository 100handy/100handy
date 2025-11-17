"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwoFactorDialog } from "@/components/TwoFactorDialog";
import { isTwoFactorEnabled } from "@/lib/supabase/security";

export function SecurityTab() {
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    // Get 2FA status
    const fetchUserData = async () => {
      const enabled = await isTwoFactorEnabled();
      setIs2FAEnabled(enabled);
    };
    fetchUserData();
  }, []);

  const handleTwoFactorSuccess = () => {
    setIs2FAEnabled(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">Account</h2>
      </div>

      <div className="space-y-6">
        {/* Two-factor authentication card */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-brand-terracotta" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-brand-dark font-bold text-lg sm:text-xl">Two-factor authentication</h3>
            {is2FAEnabled ? (
              <p className="text-brand-dark text-sm sm:text-base">
                Two-factor authentication is currently <strong>enabled</strong> on your account.
              </p>
            ) : (
              <>
                <p className="text-brand-dark text-sm sm:text-base">
                  To keep your account secure, set up two-factor authentication.
                </p>
                <p className="text-brand-dark text-sm sm:text-base">
                  We'll send a verification code to your email address to activate two-factor authentication.
                </p>
              </>
            )}
            <div className="pt-2">
              <Button
                onClick={() => setTwoFactorDialogOpen(true)}
                disabled={is2FAEnabled}
                className="bg-brand-terracotta hover:bg-brand-coral text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                {is2FAEnabled ? "Activated" : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Dialog */}
      <TwoFactorDialog
        open={twoFactorDialogOpen}
        onOpenChange={setTwoFactorDialogOpen}
        onSuccess={handleTwoFactorSuccess}
      />
    </>
  );
}

