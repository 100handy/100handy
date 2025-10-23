"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { requestAccountDeletion } from "@/lib/supabase/account";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function DeleteAccountTab() {
  const router = useRouter();
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await requestAccountDeletion();
      toast.success("Account deletion request submitted. Our team will contact you shortly.");
      setDeleteAccountDialogOpen(false);
      // Sign out after requesting deletion
      await authClient.signOut({
        onSuccess: () => router.push("/sign-in"),
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to request account deletion");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
          Account Deletion
        </h2>

        <div className="max-w-3xl space-y-6">
          <p className="text-brand-dark text-sm leading-relaxed">
            Once you've deleted your account, you will no longer be able to log in to the 100Handy site or apps. This
            action cannot be undone.
          </p>

          <Button
            onClick={() => setDeleteAccountDialogOpen(true)}
            variant="outline"
            className="text-brand-terracotta border-brand-terracotta hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">Confirm your decision</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <p className="text-brand-dark text-sm text-center">Are you sure you want to delete your account?</p>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setDeleteAccountDialogOpen(false)}
                variant="outline"
                className="text-brand-dark border-gray-300 hover:bg-gray-50 px-8"
              >
                Never mind
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="bg-brand-terracotta hover:bg-brand-coral text-white px-8"
              >
                Yes, I'm sure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

