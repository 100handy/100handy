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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { enableTwoFactor, verifyTwoFactor, isTwoFactorEnabled } from "@/lib/supabase/security";
import { toast } from "sonner";

export function SecurityTab() {
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorActivatedDialogOpen, setTwoFactorActivatedDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [otpCode, setOtpCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    isTwoFactorEnabled().then(setIs2FAEnabled);
  }, []);

  const handleEnable2FA = async () => {
    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      await enableTwoFactor(fullPhone);
      toast.success("Verification code sent to your phone");
      setTwoFactorDialogOpen(false);
      setTwoFactorActivatedDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    }
  };

  const handleVerify2FA = async () => {
    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      await verifyTwoFactor(fullPhone, otpCode);
      toast.success("Two-factor authentication enabled");
      setTwoFactorActivatedDialogOpen(false);
      setIs2FAEnabled(true);
      setPhoneNumber("");
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
                  Enter your phone number to receive the security code and activate two-factor authentication.
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
              Enter your phone number to receive your authentication code
            </p>

            <div className="flex gap-2">
              {/* Country Code Selector */}
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇬🇧</span>
                      <span>{countryCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+44">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇬🇧</span>
                      <span>+44</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="+1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <span>+1</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="+91">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇮🇳</span>
                      <span>+91</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Phone Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="7757510964"
                className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-brand-terracotta"
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleEnable2FA}
                disabled={!phoneNumber}
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
              Enter the verification code sent to {countryCode}{phoneNumber}
            </p>

            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
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
                  setPhoneNumber("");
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

