"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { enableTwoFactor, verifyTwoFactor } from "@/lib/supabase/security";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

interface TwoFactorDialogProps {
  /**
   * Controls whether the dialog flow is open
   */
  open: boolean;
  /**
   * Callback when the dialog should be closed
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Callback when 2FA is successfully enabled
   */
  onSuccess?: () => void;
  /**
   * Whether to automatically start the flow when opened
   */
  autoStart?: boolean;
}

export function TwoFactorDialog({
  open,
  onOpenChange,
  onSuccess,
  autoStart = false
}: TwoFactorDialogProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [userEmail, setUserEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get user email
    const fetchUserEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUserEmail();
  }, []);

  // Auto-start sending code if autoStart is true
  useEffect(() => {
    if (open && autoStart && userEmail && step === "send") {
      handleSendCode();
    }
  }, [open, autoStart, userEmail, step]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep("send");
      setOtpCode("");
      setIsLoading(false);
    }
  }, [open]);

  const handleSendCode = async () => {
    if (!userEmail) {
      toast.error("Email address not found");
      return;
    }

    setIsLoading(true);
    try {
      await enableTwoFactor(userEmail);
      toast.success("Verification code sent to your email");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      await verifyTwoFactor(userEmail, otpCode);
      toast.success("Two-factor authentication enabled");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setOtpCode("");
    await handleSendCode();
  };

  return (
    <>
      {/* Send Code Dialog */}
      <Dialog open={open && step === "send"} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">
              Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-brand-dark text-sm text-center">
              We'll send a verification code to your email address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-brand-dark text-sm font-medium text-center">
                {userEmail || "Loading..."}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendCode}
                disabled={!userEmail || isLoading}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-12 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verify Code Dialog */}
      <Dialog open={open && step === "verify"} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">
              Verify Authentication Code
            </DialogTitle>
            <DialogDescription className="text-brand-dark text-sm text-center">
              Enter the 6-digit code sent to {userEmail}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">

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
                autoFocus
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handleVerify}
                disabled={!otpCode || otpCode.length < 6 || isLoading}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-12 disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isLoading ? "Verifying..." : "Verify & Activate"}
              </Button>

              <div className="flex gap-4 text-sm">
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-brand-terracotta hover:underline disabled:text-gray-400"
                >
                  Resend Code
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-brand-dark hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
