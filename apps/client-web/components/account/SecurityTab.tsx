"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { enableTwoFactor, verifyTwoFactor, isTwoFactorEnabled } from "@/lib/supabase/security";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export function SecurityTab() {
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorActivatedDialogOpen, setTwoFactorActivatedDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    // Get user email and 2FA status
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
      const enabled = await isTwoFactorEnabled();
      setIs2FAEnabled(enabled);
    };
    fetchUserData();
  }, []);

  const handleEnable2FA = async () => {
    try {
      await enableTwoFactor(userEmail);
      toast.success("Verification code sent to your email");
      setTwoFactorDialogOpen(false);
      setTwoFactorActivatedDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    }
  };

  const handleVerify2FA = async () => {
    try {
      await verifyTwoFactor(userEmail, otpCode);
      toast.success("Two-factor authentication enabled");
      setTwoFactorActivatedDialogOpen(false);
      setIs2FAEnabled(true);
      setOtpCode("");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify code");
    }
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
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">
              Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-brand-dark text-sm text-center">
              We'll send a verification code to your email address
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-brand-dark text-sm font-medium text-center">
                {userEmail || "Loading..."}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleEnable2FA}
                disabled={!userEmail}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-12 disabled:bg-gray-300 disabled:text-gray-500"
              >
                Send Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Activated Dialog */}
      <Dialog open={twoFactorActivatedDialogOpen} onOpenChange={setTwoFactorActivatedDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">
              Verify Authentication Code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-brand-dark text-sm text-center">
              Enter the 6-digit code sent to {userEmail}
            </p>

            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  setOtpCode(value);
                }}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark text-center tracking-widest text-lg"
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleVerify2FA}
                disabled={!otpCode || otpCode.length < 6}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-12 disabled:bg-gray-300 disabled:text-gray-500"
              >
                Verify & Activate
              </Button>
              <button
                onClick={() => {
                  setTwoFactorActivatedDialogOpen(false);
                  setOtpCode("");
                }}
                className="text-brand-dark text-sm hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

