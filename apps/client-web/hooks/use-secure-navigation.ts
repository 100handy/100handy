"use client";

import { useEffect, useState } from "react";
import { isTwoFactorEnabled } from "@/lib/supabase/security";

/**
 * Hook for checking 2FA security requirements before accessing sensitive sections
 * Similar to mobile's useSecureNavigation hook
 */
export function useSecureNavigation() {
  const [isTwoFactorEnabledState, setIsTwoFactorEnabledState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    setIsLoading(true);
    const enabled = await isTwoFactorEnabled();
    setIsTwoFactorEnabledState(enabled);
    setIsLoading(false);
  };

  /**
   * Check if user can access a section that requires 2FA
   * @param requiresSecurity - Whether this section requires 2FA to be enabled
   * @returns true if access is allowed, false if 2FA is required but not enabled
   */
  const canAccessSection = (requiresSecurity: boolean = false): boolean => {
    if (!requiresSecurity) {
      return true;
    }

    return isTwoFactorEnabledState;
  };

  /**
   * Refresh the 2FA status (useful after enabling 2FA)
   */
  const refreshTwoFactorStatus = () => {
    checkTwoFactorStatus();
  };

  return {
    isTwoFactorEnabled: isTwoFactorEnabledState,
    canAccessSection,
    refreshTwoFactorStatus,
    isLoading,
  };
}
