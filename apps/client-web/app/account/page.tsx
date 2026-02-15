"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ProfileTab,
  PasswordTab,
  SecurityTab,
  NotificationsTab,
  BillingTab,
  BusinessTab,
  BalanceTab,
  TransactionsTab,
  DeleteAccountTab,
} from "@/components/account";
import { TwoFactorDialog } from "@/components/TwoFactorDialog";
import { useSecureNavigation } from "@/hooks/use-secure-navigation";
import { Header } from "@/components/layout";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const { isTwoFactorEnabled, canAccessSection, refreshTwoFactorStatus } = useSecureNavigation();

  // Sections that require 2FA to access
  const protectedSections = ["balance", "transactions"];

  const menuItems = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Password" },
    { id: "security", label: "Account Security" },
    { id: "notifications", label: "Notifications" },
    { id: "billing", label: "Billing Info" },
    { id: "vat", label: "VAT ID" },
    { id: "cancel", label: "Cancel a Task" },
    { id: "business", label: "Business Information" },
    { id: "balance", label: "Account Balance", requiresSecurity: true },
    { id: "transactions", label: "Transactions", requiresSecurity: true },
    { id: "delete", label: "Delete Account" },
  ];

  const handleSectionChange = (sectionId: string) => {
    const isProtected = protectedSections.includes(sectionId);

    if (isProtected && !canAccessSection(true)) {
      // Store the section they want to access
      setPendingSection(sectionId);
      // Show 2FA dialog
      setTwoFactorDialogOpen(true);
      return;
    }

    // Allow access
    setActiveSection(sectionId);
  };

  const handleTwoFactorSuccess = () => {
    // Refresh 2FA status
    refreshTwoFactorStatus();

    // Navigate to pending section if there is one
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileTab />;
      case "password":
        return <PasswordTab />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "billing":
        return <BillingTab />;
      case "vat":
        return <BusinessTab mode="vat" />;
      case "cancel":
        return (
          <div className="mb-8">
            <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
              Cancel a Task
            </h2>
            <div className="max-w-3xl space-y-6">
              <p className="text-brand-dark text-sm leading-relaxed">
                To cancel a task, go to your tasks and select the circle with three dots in the upper right corner of
                the task card. This will reveal the 'Cancel Task' button. Select 'Cancel Task' to cancel all
                appointments for that task.
              </p>
              <Link href="/my-tasks">
                <Button className="bg-brand-terracotta hover:bg-brand-coral text-white">Go to My Tasks</Button>
              </Link>
            </div>
          </div>
        );
      case "business":
        return <BusinessTab mode="business" />;
      case "balance":
        return <BalanceTab />;
      case "transactions":
        return <TransactionsTab />;
      case "delete":
        return <DeleteAccountTab />;
      default:
        return (
          <div className="py-8 text-center text-gray-500">
            <p>Content for {menuItems.find((item) => item.id === activeSection)?.label} will be added here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <h1 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 sm:mb-8">Your Account</h1>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
          {/* Sidebar Navigation - Mobile Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeSection}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-brand-dark text-base font-medium"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} {item.requiresSecurity && !isTwoFactorEnabled ? "🔒" : ""}
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
                  onClick={() => handleSectionChange(item.id)}
                  className={cn(
                    "text-sm xl:text-base font-medium text-left px-3 xl:px-4 py-3 hover:bg-gray-50 transition-colors rounded-none justify-start",
                    index < menuItems.length - 1 && "border-b border-gray-200",
                    activeSection === item.id ? "text-brand-terracotta" : "text-brand-dark"
                  )}
                >
                  <span className="flex items-center gap-2 w-full">
                    {item.label}
                    {item.requiresSecurity && !isTwoFactorEnabled && (
                      <ShieldCheck className="w-4 h-4 text-gray-400 ml-auto" />
                    )}
                  </span>
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

      {/* Two-Factor Authentication Dialog */}
      <TwoFactorDialog
        open={twoFactorDialogOpen}
        onOpenChange={setTwoFactorDialogOpen}
        onSuccess={handleTwoFactorSuccess}
      />

      <Footer />
    </div>
  );
}

