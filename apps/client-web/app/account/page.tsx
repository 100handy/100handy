"use client";

import { Mail, Phone, Home, User, Menu, ShieldCheck, Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditingVat, setIsEditingVat] = useState(false);
  const [vatId, setVatId] = useState("");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [twoFactorActivatedDialogOpen, setTwoFactorActivatedDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+44");

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    taskUpdates: {
      email: false,
      sms: true,
      push: false,
    },
    promotional: {
      email: true,
      sms: true,
      push: true,
    },
  });

  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "security", label: "Account Security" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing Info" },
    { id: "vat", label: "VAT ID" },
    { id: "cancel", label: "Cancel a Task" },
    { id: "business", label: "Business Information" },
    { id: "balance", label: "Account Balance" },
    { id: "transactions", label: "Transactions" },
    { id: "delete", label: "Delete Account" },
  ];

  const toggleNotification = (category: "taskUpdates" | "promotional", type: "email" | "sms" | "push") => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
  };

  const handleLogOut = async () => {
    try {
      await authClient.signOut({
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/sign-in");
        },
        onError: (ctx) => {
          console.error("Sign out error:", ctx.error.message);
          toast.error(ctx.error.message || "Failed to sign out");
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const CheckboxIcon = ({ checked }: { checked: boolean }) => (
    <div
      className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
        checked
          ? "bg-green-500 border-green-500"
          : "bg-white border-gray-300"
      )}
    >
      {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                Account
              </h2>
              <Button
                variant="outline"
                className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto"
              >
                Edit
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {/* Left side - Profile Image */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="/assets/profile-picture.png"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right side - User Information */}
              <div className="flex-1">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-lg sm:text-xl font-medium break-words">
                      Darya Shirobokova
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-base sm:text-xl font-medium break-all">
                      daryashirobokova0@gmail.com
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-base sm:text-xl font-medium">
                      +44 7757510000
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 text-brand-dark flex-shrink-0" />
                    <span className="text-brand-dark text-base sm:text-xl font-medium">
                      Personal Tasks
                    </span>
                  </div>

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
          </>
        );

      case "password":
        return (
          <>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                Account
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-brand-dark text-base sm:text-lg font-semibold mb-2">
                  Current Password: *********
                </p>
              </div>
            </div>
          </>
        );

      case "security":
        return (
          <>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                Account
              </h2>
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
                  <h3 className="text-brand-dark font-bold text-lg sm:text-xl">
                    Two-factor authentication
                  </h3>
                  <p className="text-brand-dark text-sm sm:text-base">
                    To keep your account secure, set up two-factor authentication.
                  </p>
                  <p className="text-brand-dark text-sm sm:text-base">
                    Enter your phone number to receive the security code and activate two-factor authentication.
                  </p>
                  <div className="pt-2">
                    <Button 
                      onClick={() => setTwoFactorDialogOpen(true)}
                      className="bg-brand-terracotta hover:bg-brand-coral text-white"
                    >
                      Activate
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
                      onClick={() => {
                        // Handle sending code
                        console.log(`Sending code to ${countryCode}${phoneNumber}`);
                        setTwoFactorDialogOpen(false);
                        setTwoFactorActivatedDialogOpen(true);
                      }}
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
                    Two-Factor Authentication is activated!
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <p className="text-brand-dark text-sm text-center">
                    If you turn off two-factor authentication, you will no longer receive a code if we notice an attempted login from an unrecognised device or browser.
                  </p>

                  <div className="flex flex-col items-center gap-3">
                    <Button
                      onClick={() => {
                        setTwoFactorActivatedDialogOpen(false);
                        setPhoneNumber("");
                      }}
                      className="bg-brand-terracotta hover:bg-brand-coral text-white px-12"
                    >
                      Got it
                    </Button>
                    <button
                      onClick={() => {
                        setTwoFactorActivatedDialogOpen(false);
                        setPhoneNumber("");
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

      case "notifications":
        return (
          <>
            <div className="mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                Notifications
              </h2>
            </div>

            <div className="space-y-8">
              {/* Notification Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                        Form of communication
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                        Email
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                        Sms
                      </th>
                      <th className="text-center py-3 px-2 sm:px-4 text-brand-dark font-semibold text-sm sm:text-base">
                        Push Notification
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Task Updates Row */}
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-2 sm:px-4 text-brand-dark text-sm sm:text-base">
                        Task Updastes
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("taskUpdates", "email")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.taskUpdates.email} />
                        </button>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("taskUpdates", "sms")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.taskUpdates.sms} />
                        </button>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("taskUpdates", "push")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.taskUpdates.push} />
                        </button>
                      </td>
                    </tr>

                    {/* Promotional Emails and Notifications Row */}
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-2 sm:px-4 text-brand-dark text-sm sm:text-base">
                        Promotional Emails and Notifications
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("promotional", "email")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.promotional.email} />
                        </button>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("promotional", "sms")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.promotional.sms} />
                        </button>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <button
                          onClick={() => toggleNotification("promotional", "push")}
                          className="inline-flex items-center justify-center mx-auto"
                        >
                          <CheckboxIcon checked={notifications.promotional.push} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button
                  variant="outline"
                  className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto px-8"
                >
                  Cancel
                </Button>
                <Button className="bg-brand-terracotta hover:bg-brand-coral text-white w-full sm:w-auto px-8">
                  Save
                </Button>
              </div>
            </div>
          </>
        );

      case "billing":
        return (
          <>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-8">
                Edit Billing Info
              </h2>

              <div className="space-y-6 max-w-2xl">
                {/* Card Payment Section */}
                <div>
                  <h3 className="text-brand-dark text-base mb-4">
                    Card Payment
                  </h3>

                  {/* Card Input Fields */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Card Number Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg
                            width="16"
                            height="12"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="15"
                              height="11"
                              rx="1"
                              stroke="currentColor"
                            />
                            <line x1="0" y1="3" x2="16" y2="3" stroke="currentColor" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* MM / YY CVC Input */}
                    <div className="w-full sm:w-40">
                      <input
                        type="text"
                        placeholder="MM / YY CVC"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <Button
                      variant="outline"
                      className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto px-6 h-9 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled
                      className="bg-gray-200 text-gray-400 w-full sm:w-auto px-6 h-9 text-sm cursor-not-allowed hover:bg-gray-200"
                    >
                      Save
                    </Button>
                  </div>

                  {/* Info Text */}
                  <p className="text-brand-dark text-xs sm:text-sm">
                    Payment method will upgrade for all tasks, including the ones currently open.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case "cancel":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
                Cancel a Task
              </h2>

              <div className="max-w-3xl space-y-6">
                <p className="text-brand-dark text-sm leading-relaxed">
                  To cancel a task, go to your tasks and select the circle with three dots in the upper right corner of the task card. This will reveal the 'Cancel Task' button. Select 'Cancel Task' to cancel all appointments for that task.
                </p>

                <Button className="bg-brand-terracotta hover:bg-brand-coral text-white">
                  Go to My Tasks
                </Button>
              </div>
            </div>
          </>
        );

      case "business":
        return (
          <>
            <div className="mb-8">
              <div className="max-w-3xl space-y-6">
                <p className="text-brand-dark text-sm leading-relaxed">
                  Your information is required to comply with local and federal regulations. Failure to provide this information may cause payouts on your accounts to be paused until information is received.
                </p>

                <Button className="bg-brand-terracotta hover:bg-brand-coral text-white">
                  Update my info
                </Button>
              </div>
            </div>
          </>
        );

      case "balance":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
                Account Balance
              </h2>

              <div className="max-w-3xl space-y-6">
                <div>
                  <p className="text-brand-dark text-sm font-semibold">
                    Available account balance: £0
                  </p>
                  <p className="text-brand-dark text-xs mt-1">
                    *Account balances are automatically applied when a task is completed.
                  </p>
                </div>

                <div>
                  <label className="block text-brand-dark text-sm mb-2">
                    Enter a redemption code:
                  </label>
                  <input
                    type="text"
                    className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
                  />
                </div>

                <Button className="bg-brand-terracotta hover:bg-brand-coral text-white">
                  Apply
                </Button>
              </div>
            </div>
          </>
        );

      case "transactions":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
                Transaction History
              </h2>

              <div className="max-w-3xl space-y-6">
                <button 
                  onClick={() => setDownloadDialogOpen(true)}
                  className="flex items-center gap-2 text-brand-terracotta hover:text-brand-coral text-sm font-medium transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M14 9V13C14 13.5304 13.7893 14.0391 13.4142 14.4142C13.0391 14.7893 12.5304 15 12 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 6.5L8 10L11.5 6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 10V1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Transaction History
                </button>

                <p className="text-brand-dark text-sm">
                  You don't have any transactions yet. Get started!
                </p>
              </div>
            </div>

            {/* Download History Dialog */}
            <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-brand-dark text-xl font-semibold">
                    Download History
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Year Selection */}
                  <div className="space-y-3">
                    <label className="text-brand-dark text-sm font-medium">
                      Please choose a year.
                    </label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a year..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-3">
                    <p className="text-brand-dark text-sm text-center">
                      Then select a format to start your download.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => {
                          if (selectedYear) {
                            // Handle PDF download
                            console.log(`Downloading ${selectedYear} as PDF`);
                            setDownloadDialogOpen(false);
                          }
                        }}
                        disabled={!selectedYear}
                        className="bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 text-white px-8 disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        PDF
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedYear) {
                            // Handle CSV download
                            console.log(`Downloading ${selectedYear} as CSV`);
                            setDownloadDialogOpen(false);
                          }
                        }}
                        disabled={!selectedYear}
                        className="bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 text-white px-8 disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        );

      case "vat":
        return (
          <>
            {!isEditingVat ? (
              // View Mode
              <>
                <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6">
                  <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                    VAT ID
                  </h2>
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
                    If you operate as a VAT registered business, please enter your VAT number here – this prevents VAT being applied on the Service Fee and the Trust & Support Fee.
                  </p>
                </div>
              </>
            ) : (
              // Edit Mode
              <>
                <div className="mb-8">
                  <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-8">
                    Edit VAT ID
                  </h2>

                  <div className="space-y-6 max-w-xl">
                    {/* VAT ID Input */}
                    <div>
                      <label className="block text-brand-dark text-sm mb-2">
                        VAT ID
                      </label>
                      <input
                        type="text"
                        value={vatId}
                        onChange={(e) => setVatId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta text-brand-dark"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditingVat(false);
                          setVatId("");
                        }}
                        className="text-brand-dark border-gray-300 hover:bg-gray-50 w-full sm:w-auto px-6 h-9 text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Save VAT ID logic here
                          setIsEditingVat(false);
                        }}
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

      case "delete":
        return (
          <>
            <div className="mb-8">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
                Account Deletion
              </h2>

              <div className="max-w-3xl space-y-6">
                <p className="text-brand-dark text-sm leading-relaxed">
                  Once you've deleted your account, you will no longer be able to log in to the 100Handy site or apps. This action cannot be undone.
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
                  <DialogTitle className="text-brand-dark text-xl font-semibold">
                    Confirm your decision
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <p className="text-brand-dark text-sm text-center">
                    Are you sure you want to delete your account?
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={() => setDeleteAccountDialogOpen(false)}
                      variant="outline"
                      className="text-brand-dark border-gray-300 hover:bg-gray-50 px-8"
                    >
                      Never mind
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle account deletion
                        console.log('Deleting account...');
                        setDeleteAccountDialogOpen(false);
                      }}
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

      default:
        return (
          <>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-b border-gray-300 pb-4 sm:pb-6 gap-4 sm:gap-0">
              <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px]">
                {menuItems.find((item) => item.id === activeSection)?.label || "Account"}
              </h2>
            </div>
            <div className="py-8 text-center text-gray-500">
              <p>Content for {menuItems.find((item) => item.id === activeSection)?.label} will be added here.</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            <div className="flex items-center gap-2">
              <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">
                100 HANDY
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta">
                Book a Task
              </Button>
              <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta">
                My Tasks
              </Button>
              <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta">
                Account
              </Button>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-brand-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4">
            <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta justify-start">
              Book a Task
            </Button>
            <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta justify-start">
              My Tasks
            </Button>
            <Button variant="ghost" className="text-brand-dark font-bold hover:text-brand-terracotta justify-start">
              Account
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <h1 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 sm:mb-8">
          Your Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
          {/* Sidebar Navigation - Mobile Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-brand-dark text-base font-medium"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-[180px] xl:w-[200px] bg-white border border-gray-300 rounded-l-lg flex-shrink-0">
            <nav className="flex flex-col">
              {menuItems.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "text-sm xl:text-base font-medium text-left px-3 xl:px-4 py-3 hover:bg-gray-50 transition-colors rounded-none justify-start",
                    index < menuItems.length - 1 && "border-b border-gray-200",
                    activeSection === item.id
                      ? "text-brand-terracotta"
                      : "text-brand-dark"
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 bg-white border border-gray-300 rounded-lg lg:border-l-0 lg:rounded-l-none lg:rounded-r-lg p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
