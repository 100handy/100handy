"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TwoFactorDialog } from "@/components/TwoFactorDialog";
import { updatePasswordWithVerification } from "@/lib/supabase/password";
import { useSecureNavigation } from "@/hooks/use-secure-navigation";
import { toast } from "sonner";

export function PasswordTab() {
  const { canAccessSection, refreshTwoFactorStatus } = useSecureNavigation();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);

  const handlePasswordEdit = () => {
    // Check if 2FA is enabled before allowing password edit
    if (!canAccessSection(true)) {
      setTwoFactorDialogOpen(true);
      return;
    }
    setIsEditingPassword(true);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePasswordWithVerification(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTwoFactorSuccess = () => {
    refreshTwoFactorStatus();
    setIsEditingPassword(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">Password</h2>
        {!isEditingPassword ? (
          <Button
            variant="outline"
            onClick={handlePasswordEdit}
            className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          >
            Edit
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePasswordCancel}
              className="text-brand-dark border-gray-300 hover:bg-gray-50 flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="bg-brand-terracotta hover:bg-brand-coral text-white flex-1 sm:flex-none disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isChangingPassword ? "Updating..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6 max-w-xl">
        {!isEditingPassword ? (
          <div className="space-y-4">
            <p className="text-brand-dark text-base">
              Your password is securely stored and encrypted.
            </p>
            <p className="text-gray-600 text-sm">
              Click "Edit" to change your password. You'll need to enter your current password for verification.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-brand-dark text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
              />
            </div>
          </>
        )}
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

