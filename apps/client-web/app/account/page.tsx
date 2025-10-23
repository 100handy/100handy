"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ProfileTab,
  PasswordTab,
  SecurityTab,
  NotificationsTab,
  BusinessTab,
  BalanceTab,
  TransactionsTab,
  DeleteAccountTab,
} from "@/components/account";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        return (
          <div className="mb-8">
            <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-8">Edit Billing Info</h2>
            <div className="max-w-2xl">
              <p className="text-brand-dark text-sm mb-4">Stripe integration coming soon...</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-brand-dark text-base mb-4">Card Payment</h3>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Card Number"
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm text-brand-dark placeholder:text-gray-400 bg-gray-100"
                      />
                    </div>
                    <div className="w-full sm:w-40">
                      <input
                        type="text"
                        placeholder="MM / YY CVC"
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-300 rounded text-sm text-brand-dark placeholder:text-gray-400 bg-gray-100"
                      />
                    </div>
                  </div>
                  <p className="text-brand-dark text-xs sm:text-sm">
                    Payment method will upgrade for all tasks, including the ones currently open.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
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
              <Button className="bg-brand-terracotta hover:bg-brand-coral text-white">Go to My Tasks</Button>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[70px]">
            <div className="flex items-center gap-2">
              <span className="text-brand-dark-alt font-bold text-lg sm:text-xl font-display">100 HANDY</span>
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
        <h1 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 sm:mb-8">Your Account</h1>

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
                    activeSection === item.id ? "text-brand-terracotta" : "text-brand-dark"
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

