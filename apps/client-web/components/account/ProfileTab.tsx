"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Mail, Phone, Home, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwoFactorDialog } from "@/components/TwoFactorDialog";
import { useProfile } from "@/hooks/use-profile";
import { useSecureNavigation } from "@/hooks/use-secure-navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProfileTab() {
  const router = useRouter();
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const { isTwoFactorEnabled, canAccessSection, refreshTwoFactorStatus } = useSecureNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    postcode: profile?.postcode || "",
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile && !isEditingProfile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        postcode: profile.postcode || "",
      });
    }
  }, [profile, isEditingProfile]);

  const handleProfileEdit = () => {
    // Check if 2FA is enabled before allowing edit
    if (!canAccessSection(true)) {
      setTwoFactorDialogOpen(true);
      return;
    }
    setIsEditingProfile(true);
  };

  const handleTwoFactorSuccess = () => {
    refreshTwoFactorStatus();
    setIsEditingProfile(true);
  };

  const handleProfileSave = () => {
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        postcode: profile.postcode || "",
      });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image");
        return;
      }
      uploadAvatar(file);
    }
  };

  const handleLogOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">Account</h2>
        {!isEditingProfile ? (
          <Button
            variant="outline"
            onClick={handleProfileEdit}
            className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
          >
            Edit
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleProfileCancel}
              className="text-brand-dark border-gray-300 hover:bg-gray-50 flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProfileSave}
              className="bg-brand-terracotta hover:bg-brand-coral text-white flex-1 sm:flex-none"
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-200 group">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-terracotta text-white text-4xl font-bold">
                {profile?.first_name?.[0] || profile?.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            {isEditingProfile && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="flex-1">
          <div className="space-y-3 sm:space-y-4">
            {!isEditingProfile ? (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                  <span className="text-brand-dark text-lg sm:text-xl font-medium break-words">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.email || "Loading..."}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                  <span className="text-brand-dark text-base sm:text-xl font-medium break-all">
                    {profile?.email || "Loading..."}
                  </span>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-base sm:text-xl font-medium">{profile.phone}</span>
                  </div>
                )}

                {profile?.postcode && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-base sm:text-xl font-medium">{profile.postcode}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-brand-dark text-base sm:text-lg font-medium">
                    Role: {profile?.role || "customer"}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-brand-dark text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-brand-dark"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-brand-dark text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-brand-dark"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-brand-dark text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-brand-dark"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-brand-dark text-sm font-medium">Postcode</label>
                  <input
                    type="text"
                    value={profileForm.postcode}
                    onChange={(e) => setProfileForm({ ...profileForm, postcode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded text-brand-dark"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-brand-dark text-sm font-medium">Email (read-only)</label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded text-gray-500 bg-gray-100"
                  />
                </div>
              </>
            )}

            {/* Log Out Button */}
            <div className="pt-2 sm:pt-4">
              <Button
                variant="outline"
                onClick={handleLogOut}
                className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
              >
                Log Out
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

